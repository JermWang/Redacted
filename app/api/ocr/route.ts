"use server"

import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const investigationId = formData.get("investigationId") as string
  const model = (formData.get("model") as string) || "anthropic/claude-sonnet-4"

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 })
  }

  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const mimeType = file.type || "image/png"

    // Use AI Vision to extract text from image
    const { text: ocrText } = await generateText({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: `data:${mimeType};base64,${base64}`,
            },
            {
              type: "text",
              text: `You are an OCR specialist. Extract ALL text from this document image exactly as it appears. 
              
Instructions:
- Preserve the original formatting, line breaks, and structure as much as possible
- Include all visible text, headers, footers, stamps, handwritten notes
- Mark any redacted/blacked out sections as [REDACTED]
- Mark any illegible text as [ILLEGIBLE]
- Do not add any commentary or interpretation, just extract the raw text
- If this appears to be a form or table, preserve the structure using spacing or markdown tables`,
            },
          ],
        },
      ],
    })

    // Store document in Supabase
    const supabase = await createClient()
    
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .insert({
        investigation_id: investigationId || null,
        filename: file.name,
        ocr_text: ocrText,
        status: "processed",
        metadata: {
          size: file.size,
          type: file.type,
          model_used: model,
          processed_at: new Date().toISOString(),
        },
      })
      .select()
      .single()

    if (docError) {
      console.error("Error storing document:", docError)
      return Response.json({ error: "Failed to store document" }, { status: 500 })
    }

    // Log agent activity
    await supabase.from("agent_activity").insert({
      agent_id: "ocr-agent",
      agent_model: model,
      action_type: "document_processed",
      description: `Processed document: ${file.name}`,
      investigation_id: investigationId || null,
      metadata: {
        document_id: doc.id,
        text_length: ocrText.length,
      },
    })

    return Response.json({
      success: true,
      document: doc,
      text: ocrText,
    })
  } catch (error) {
    console.error("OCR Error:", error)
    return Response.json({ error: "OCR processing failed" }, { status: 500 })
  }
}
