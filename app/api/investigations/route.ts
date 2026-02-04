import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("investigations")
    .select(`
      *,
      documents(count),
      evidence_packets(count)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ investigations: data })
}

export async function POST(req: Request) {
  const { 
    title, 
    description, 
    priority, 
    tags,
    createdBy = "anonymous",
    createdByType = "human"
  } = await req.json()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("investigations")
    .insert({
      title,
      description,
      priority: priority || "medium",
      tags: tags || [],
      created_by: createdBy,
      created_by_type: createdByType,
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ investigation: data })
}
