import { createClient } from "@/lib/supabase/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // Get current vote count
  const { data: current } = await supabase
    .from("evidence_packets")
    .select("votes")
    .eq("id", id)
    .single()

  if (!current) {
    return Response.json({ error: "Evidence not found" }, { status: 404 })
  }

  // Increment vote
  const { data, error } = await supabase
    .from("evidence_packets")
    .update({ votes: (current.votes || 0) + 1 })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ evidence: data })
}
