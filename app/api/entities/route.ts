import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get("limit") || "50")
  
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("entities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ entities: data })
}
