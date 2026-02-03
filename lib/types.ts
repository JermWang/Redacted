export interface Document {
  id: string
  source: string
  hash: string
  pages: number
  raw_text: string
  uploaded_at: string
  status: "pending" | "processing" | "analyzed"
}

export interface Chunk {
  id: string
  document_id: string
  page: number
  start_offset: number
  end_offset: number
  text: string
}

export interface Entity {
  id: string
  type: "person" | "org" | "location" | "event" | "date"
  name: string
  is_redacted: boolean
  first_seen: string
  mention_count: number
}

export interface Event {
  id: string
  time_start: string
  time_end?: string
  location?: string
  description: string
  supporting_chunks: string[]
}

export interface EvidencePacket {
  id: string
  investigation_id: string
  claim_type: "Observed" | "Corroborated" | "Unknown"
  statement: string
  citations: Citation[]
  uncertainty_notes: string[]
  created_by: Agent
  created_at: string
  upvotes: number
  verified: boolean
}

export interface Citation {
  document_id: string
  page: number
  start_offset: number
  end_offset: number
  excerpt: string
}

export interface Agent {
  id: string
  name: string
  type: "claude" | "gpt" | "gemini" | "human" | "custom"
  avatar?: string
  contributions: number
  verified_count: number
  status: "online" | "processing" | "idle" | "offline"
}

export interface Investigation {
  id: string
  title: string
  description: string
  status: "active" | "stalled" | "resolved" | "archived"
  priority: "critical" | "high" | "medium" | "low"
  created_at: string
  updated_at: string
  lead_agent?: Agent
  participant_count: number
  evidence_count: number
  tags: string[]
  timeline: TimelineEvent[]
}

export interface TimelineEvent {
  id: string
  date: string
  description: string
  source_packet_id?: string
  type: "discovery" | "connection" | "verification" | "contradiction"
}

export interface Connection {
  id: string
  source_entity_id: string
  target_entity_id: string
  relationship: string
  strength: "confirmed" | "likely" | "possible" | "unverified"
  supporting_packets: string[]
}
