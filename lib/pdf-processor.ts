// @ts-ignore - pdf-parse types
import pdf from 'pdf-parse'
import { createClient } from '@supabase/supabase-js'

interface PDFExtractResult {
  text: string
  pages: number
  metadata: {
    title?: string
    author?: string
    subject?: string
    creator?: string
    creationDate?: Date
    modificationDate?: Date
  }
  chunks: PDFChunk[]
}

interface PDFChunk {
  pageNumber: number
  content: string
  startIndex: number
  endIndex: number
}

interface EntityExtraction {
  names: string[]
  dates: string[]
  locations: string[]
  organizations: string[]
  amounts: string[]
}

const CHUNK_SIZE = 1500 // characters per chunk for AI processing

export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractResult> {
  const data = await pdf(buffer)
  
  const chunks = chunkText(data.text, CHUNK_SIZE)
  
  return {
    text: data.text,
    pages: data.numpages,
    metadata: {
      title: data.info?.Title,
      author: data.info?.Author,
      subject: data.info?.Subject,
      creator: data.info?.Creator,
      creationDate: data.info?.CreationDate ? new Date(data.info.CreationDate) : undefined,
      modificationDate: data.info?.ModDate ? new Date(data.info.ModDate) : undefined,
    },
    chunks: chunks.map((content, i) => ({
      pageNumber: Math.floor(i / 3) + 1, // approximate page mapping
      content,
      startIndex: i * CHUNK_SIZE,
      endIndex: Math.min((i + 1) * CHUNK_SIZE, data.text.length),
    })),
  }
}

export function chunkText(text: string, chunkSize: number): string[] {
  const chunks: string[] = []
  const sentences = text.split(/(?<=[.!?])\s+/)
  let currentChunk = ''

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > chunkSize) {
      if (currentChunk) chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += ' ' + sentence
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim())
  return chunks
}

export function extractEntities(text: string): EntityExtraction {
  // Name patterns (capitalized words that look like names)
  const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g
  const names = [...new Set(text.match(namePattern) || [])]

  // Date patterns
  const datePattern = /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})\b/g
  const dates = [...new Set(text.match(datePattern) || [])]

  // Location patterns (cities, states, countries)
  const locationPattern = /\b(?:New York|Los Angeles|Miami|Palm Beach|Little St\. James|Virgin Islands|Manhattan|Florida|California|Nevada|Paris|London)\b/gi
  const locations = [...new Set(text.match(locationPattern) || [])]

  // Organization patterns
  const orgPattern = /\b(?:FBI|DOJ|CIA|Department of Justice|U\.S\. Attorney|Southern District|Court|Foundation|Inc\.|LLC|Corp\.?|University|Institute)\b/gi
  const organizations = [...new Set(text.match(orgPattern) || [])]

  // Money amounts
  const amountPattern = /\$[\d,]+(?:\.\d{2})?(?:\s*(?:million|billion|thousand))?/gi
  const amounts = [...new Set(text.match(amountPattern) || [])]

  return { names, dates, locations, organizations, amounts }
}

export function detectRedactedSections(text: string): { start: number; end: number; type: string }[] {
  const redactions: { start: number; end: number; type: string }[] = []
  
  // Common redaction patterns
  const patterns = [
    { regex: /\[REDACTED\]/gi, type: 'explicit' },
    { regex: /█+/g, type: 'block' },
    { regex: /_{10,}/g, type: 'underscore' },
    { regex: /X{5,}/g, type: 'x-marks' },
    { regex: /\*{5,}/g, type: 'asterisk' },
    { regex: /\[.*?SEALED.*?\]/gi, type: 'sealed' },
    { regex: /\(b\)\(\d\)/g, type: 'foia-exemption' },
  ]

  for (const { regex, type } of patterns) {
    let match
    while ((match = regex.exec(text)) !== null) {
      redactions.push({
        start: match.index,
        end: match.index + match[0].length,
        type,
      })
    }
  }

  return redactions.sort((a, b) => a.start - b.start)
}

export async function processDocumentForInvestigation(
  buffer: Buffer,
  investigationId: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<{ documentId: string; chunks: number; entities: EntityExtraction }> {
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  const extracted = await extractTextFromPDF(buffer)
  const entities = extractEntities(extracted.text)
  const redactions = detectRedactedSections(extracted.text)

  // Store document
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .insert({
      investigation_id: investigationId,
      title: extracted.metadata.title || 'Untitled Document',
      content: extracted.text,
      page_count: extracted.pages,
      metadata: extracted.metadata,
      redaction_count: redactions.length,
    })
    .select()
    .single()

  if (docError) throw docError

  // Store chunks for AI processing
  const chunkInserts = extracted.chunks.map((chunk, i) => ({
    document_id: doc.id,
    investigation_id: investigationId,
    chunk_index: i,
    content: chunk.content,
    page_number: chunk.pageNumber,
  }))

  await supabase.from('document_chunks').insert(chunkInserts)

  // Store extracted entities
  for (const name of entities.names) {
    await supabase.from('entities').upsert({
      investigation_id: investigationId,
      name,
      type: 'person',
      mention_count: 1,
    }, { onConflict: 'investigation_id,name' })
  }

  return {
    documentId: doc.id,
    chunks: extracted.chunks.length,
    entities,
  }
}
