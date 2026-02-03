import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const investigationId = searchParams.get("investigationId")
  
  const supabase = await createClient()

  let query = supabase
    .from("documents")
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

  return Response.json({ documents: data })
}
