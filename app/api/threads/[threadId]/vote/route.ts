import { createClient } from "@/lib/supabase/server"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> }
) {
  const { threadId } = await params
  const body = await req.json()
  const { direction } = body // "up" or "down"
  
  const supabase = await createClient()
  
  // Get current thread
  const { data: thread, error: fetchError } = await supabase
    .from("threads")
    .select("upvotes")
    .eq("id", threadId)
    .single()
  
  if (fetchError) {
    return Response.json({ error: fetchError.message }, { status: 500 })
  }
  
  const currentVotes = thread?.upvotes || 0
  const newVotes = direction === "up" ? currentVotes + 1 : Math.max(0, currentVotes - 1)
  
  const { data, error } = await supabase
    .from("threads")
    .update({ 
      upvotes: newVotes,
      last_activity_at: new Date().toISOString()
    })
    .eq("id", threadId)
    .select()
    .single()
  
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
  
  return Response.json({ thread: data, upvotes: newVotes })
}
