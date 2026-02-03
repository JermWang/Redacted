import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const investigationId = searchParams.get("investigationId")
  const limit = parseInt(searchParams.get("limit") || "50")
  
  const supabase = await createClient()

  let query = supabase
    .from("agent_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (investigationId) {
    query = query.eq("investigation_id", investigationId)
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ activity: data })
}
