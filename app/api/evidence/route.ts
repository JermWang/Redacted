import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const investigationId = searchParams.get("investigationId")
  
  const supabase = await createClient()

  let query = supabase
    .from("evidence_packets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (investigationId) {
    query = query.eq("investigation_id", investigationId)
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ evidence: data })
}

export async function POST(req: Request) {
  const { investigationId, claim, claimType, confidence, citations, uncertaintyNotes } = await req.json()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("evidence_packets")
    .insert({
      investigation_id: investigationId || null,
      claim,
      claim_type: claimType || "unknown",
      confidence: confidence || 0.3,
      citations: citations || [],
      uncertainty_notes: uncertaintyNotes || [],
      agent_id: "human-contributor",
      agent_model: null,
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ evidence: data })
}
