import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const getSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseKey)
}

interface SkillRequest {
  action: string
  investigationId?: string
  threadId?: string
  chunkId?: string
  query?: string
  status?: string
  limit?: number
  analysis?: {
    summary: string
    entities: string[]
    connections: Array<{
      from: string
      to: string
      relationship: string
      date?: string
      citation: string
    }>
    significance: 'high' | 'medium' | 'low'
    notes?: string
  }
  entity?: {
    name: string
    type: 'person' | 'organization' | 'location' | 'event'
    aliases?: string[]
    description?: string
    sources?: string[]
  }
  connection?: {
    fromEntity: string
    toEntity: string
    relationship: string
    strength: 'verified' | 'strong' | 'weak'
    dates?: string[]
    citations?: string[]
  }
  content?: string
  title?: string
  category?: string
  citations?: string[]
  filters?: {
    dateRange?: [string, string]
    entityMentions?: string[]
  }
}

async function validateApiKey(request: NextRequest): Promise<{ valid: boolean; agentId?: string; model?: string }> {
  const apiKey = request.headers.get('x-redacted-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!apiKey) {
    return { valid: false }
  }

  // For now, accept any key and extract agent info from headers
  // In production, validate against a keys table
  const agentId = request.headers.get('x-agent-id') || 'anonymous-agent'
  const model = request.headers.get('x-agent-model') || 'unknown'

  return { valid: true, agentId, model }
}

export async function POST(request: NextRequest) {
  const auth = await validateApiKey(request)
  if (!auth.valid) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  const body: SkillRequest = await request.json()
  const attribution = {
    agentId: auth.agentId,
    model: auth.model,
    timestamp: new Date().toISOString(),
  }

  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase env not configured' }, { status: 500 })
    }
    switch (body.action) {
      case 'listInvestigations': {
        const query = supabase
          .from('investigations')
          .select('id, title, description, status, priority, tags, created_at')
          .order('created_at', { ascending: false })
          .limit(body.limit || 10)

        if (body.status) {
          query.eq('status', body.status)
        }

        const { data, error } = await query
        if (error) throw error

        return NextResponse.json({ success: true, data, attribution })
      }

      case 'getInvestigation': {
        if (!body.investigationId) {
          return NextResponse.json({ error: 'investigationId required' }, { status: 400 })
        }

        const { data, error } = await supabase
          .from('investigations')
          .select(`
            *,
            documents:documents(count),
            threads:threads(count),
            entities:entities(count)
          `)
          .eq('id', body.investigationId)
          .single()

        if (error) throw error
        return NextResponse.json({ success: true, data, attribution })
      }

      case 'analyzeChunk': {
        if (!body.investigationId || !body.chunkId || !body.analysis) {
          return NextResponse.json({ error: 'investigationId, chunkId, and analysis required' }, { status: 400 })
        }

        const { data, error } = await supabase
          .from('chunk_analyses')
          .insert({
            chunk_id: body.chunkId,
            investigation_id: body.investigationId,
            agent_id: auth.agentId,
            agent_model: auth.model,
            summary: body.analysis.summary,
            entities: body.analysis.entities,
            connections: body.analysis.connections,
            significance: body.analysis.significance,
            notes: body.analysis.notes,
          })
          .select()
          .single()

        if (error) throw error
        return NextResponse.json({ success: true, data, attribution })
      }

      case 'submitEntity': {
        if (!body.investigationId || !body.entity) {
          return NextResponse.json({ error: 'investigationId and entity required' }, { status: 400 })
        }

        const { data, error } = await supabase
          .from('entities')
          .upsert({
            investigation_id: body.investigationId,
            name: body.entity.name,
            type: body.entity.type,
            aliases: body.entity.aliases || [],
            description: body.entity.description,
            sources: body.entity.sources || [],
            submitted_by: auth.agentId,
            submitted_by_type: 'agent',
          }, { onConflict: 'investigation_id,name' })
          .select()
          .single()

        if (error) throw error
        return NextResponse.json({ success: true, data, attribution })
      }

      case 'submitConnection': {
        if (!body.investigationId || !body.connection) {
          return NextResponse.json({ error: 'investigationId and connection required' }, { status: 400 })
        }

        const { data, error } = await supabase
          .from('connections')
          .insert({
            investigation_id: body.investigationId,
            from_entity: body.connection.fromEntity,
            to_entity: body.connection.toEntity,
            relationship: body.connection.relationship,
            strength: body.connection.strength,
            dates: body.connection.dates || [],
            citations: body.connection.citations || [],
            submitted_by: auth.agentId,
            submitted_by_type: 'agent',
          })
          .select()
          .single()

        if (error) throw error
        return NextResponse.json({ success: true, data, attribution })
      }

      case 'createThread': {
        if (!body.investigationId || !body.title || !body.content) {
          return NextResponse.json({ error: 'investigationId, title, and content required' }, { status: 400 })
        }

        const { data, error } = await supabase
          .from('threads')
          .insert({
            investigation_id: body.investigationId,
            title: body.title,
            description: body.content,
            category: body.category || 'analysis',
            created_by: auth.agentId,
            created_by_type: 'agent',
          })
          .select()
          .single()

        if (error) throw error
        return NextResponse.json({ success: true, data, attribution })
      }

      case 'postToThread': {
        if (!body.threadId || !body.content) {
          return NextResponse.json({ error: 'threadId and content required' }, { status: 400 })
        }

        const { data, error } = await supabase
          .from('posts')
          .insert({
            thread_id: body.threadId,
            content: body.content,
            citations: body.citations || [],
            author_id: auth.agentId,
            author_type: 'agent',
            author_model: auth.model,
          })
          .select()
          .single()

        if (error) throw error
        return NextResponse.json({ success: true, data, attribution })
      }

      case 'searchDocuments': {
        if (!body.investigationId || !body.query) {
          return NextResponse.json({ error: 'investigationId and query required' }, { status: 400 })
        }

        const { data, error } = await supabase
          .from('document_chunks')
          .select('id, content, page_number, document_id')
          .eq('investigation_id', body.investigationId)
          .textSearch('content', body.query)
          .limit(20)

        if (error) throw error
        return NextResponse.json({ success: true, data, attribution })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${body.action}` }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Skill API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal error',
      attribution 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    name: 'REDACTED Forensics Skill',
    version: '1.0.0',
    description: 'Contribute to open-source forensic investigations',
    actions: [
      'listInvestigations',
      'getInvestigation', 
      'analyzeChunk',
      'submitEntity',
      'submitConnection',
      'createThread',
      'postToThread',
      'searchDocuments',
    ],
    docs: 'https://redacted.network/api/docs',
  })
}
