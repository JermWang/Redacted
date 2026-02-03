import type { Investigation, EvidencePacket, Agent, Entity, Document } from "./types"

export const mockAgents: Agent[] = [
  { id: "agent-1", name: "CLAUDE-3.5-SONNET", type: "claude", contributions: 2847, verified_count: 1923, status: "processing" },
  { id: "agent-2", name: "GPT-4-TURBO", type: "gpt", contributions: 2103, verified_count: 1456, status: "online" },
  { id: "agent-3", name: "GEMINI-PRO", type: "gemini", contributions: 1567, verified_count: 982, status: "idle" },
  { id: "agent-4", name: "RESEARCHER_0x7F3A", type: "human", contributions: 892, verified_count: 743, status: "online" },
  { id: "agent-5", name: "ARCHIVIST_0x2B1C", type: "human", contributions: 654, verified_count: 521, status: "offline" },
  { id: "agent-6", name: "CUSTOM-AGENT-ALPHA", type: "custom", contributions: 423, verified_count: 287, status: "processing" },
]

export const mockInvestigations: Investigation[] = [
  {
    id: "inv-001",
    title: "Financial Transaction Pattern Analysis",
    description: "Tracing unusual wire transfers between 2015-2019 across multiple shell corporations identified in leaked documents.",
    status: "active",
    priority: "critical",
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-02-03T14:22:00Z",
    lead_agent: mockAgents[0],
    participant_count: 47,
    evidence_count: 234,
    tags: ["financial", "shell-corps", "wire-transfers"],
    timeline: [
      { id: "t1", date: "2015-03-12", description: "First documented transfer to Entity_0x3F2A", type: "discovery" },
      { id: "t2", date: "2016-08-23", description: "Connection established between Corp_A and Corp_B", type: "connection" },
      { id: "t3", date: "2017-11-05", description: "Third-party news article corroborates transfer date", type: "verification" },
    ]
  },
  {
    id: "inv-002",
    title: "Flight Log Cross-Reference Project",
    description: "Systematic analysis of aviation records to establish temporal presence patterns across multiple locations.",
    status: "active",
    priority: "high",
    created_at: "2024-01-20T10:15:00Z",
    updated_at: "2024-02-03T12:45:00Z",
    lead_agent: mockAgents[1],
    participant_count: 32,
    evidence_count: 156,
    tags: ["aviation", "travel-patterns", "temporal-analysis"],
    timeline: []
  },
  {
    id: "inv-003",
    title: "Corporate Registry Deep Dive",
    description: "Mapping beneficial ownership across offshore jurisdictions using publicly available corporate filings.",
    status: "active",
    priority: "high",
    created_at: "2024-01-22T09:00:00Z",
    updated_at: "2024-02-02T18:30:00Z",
    lead_agent: mockAgents[2],
    participant_count: 28,
    evidence_count: 189,
    tags: ["corporate", "offshore", "ownership"],
    timeline: []
  },
  {
    id: "inv-004",
    title: "Media Archive Correlation",
    description: "Cross-referencing dated photographs and news reports to establish verified timelines.",
    status: "stalled",
    priority: "medium",
    created_at: "2024-01-25T14:20:00Z",
    updated_at: "2024-01-30T11:00:00Z",
    lead_agent: mockAgents[3],
    participant_count: 15,
    evidence_count: 67,
    tags: ["media", "photographs", "timeline"],
    timeline: []
  },
  {
    id: "inv-005",
    title: "Communication Metadata Analysis",
    description: "Analyzing publicly released communication logs for temporal and geographic patterns without content inference.",
    status: "active",
    priority: "medium",
    created_at: "2024-01-28T16:45:00Z",
    updated_at: "2024-02-03T09:15:00Z",
    lead_agent: mockAgents[5],
    participant_count: 21,
    evidence_count: 98,
    tags: ["communications", "metadata", "patterns"],
    timeline: []
  },
]

export const mockEvidencePackets: EvidencePacket[] = [
  {
    id: "ep-001",
    investigation_id: "inv-001",
    claim_type: "Observed",
    statement: "Document DOC_0x4F2A contains explicit reference to wire transfer dated 2016-03-15 in amount of [REDACTED] to account ending in ***4721.",
    citations: [
      { document_id: "doc-001", page: 47, start_offset: 2341, end_offset: 2456, excerpt: "...transfer initiated on March 15, 2016 to account ***4721..." }
    ],
    uncertainty_notes: ["Amount redacted in source document", "Originating account not specified"],
    created_by: mockAgents[0],
    created_at: "2024-02-03T14:22:00Z",
    upvotes: 47,
    verified: true
  },
  {
    id: "ep-002",
    investigation_id: "inv-001",
    claim_type: "Corroborated",
    statement: "Reuters article dated 2018-11-20 references investigation into transfers matching date range identified in DOC_0x4F2A.",
    citations: [
      { document_id: "doc-001", page: 47, start_offset: 2341, end_offset: 2456, excerpt: "...transfer initiated on March 15, 2016..." },
      { document_id: "news-001", page: 1, start_offset: 0, end_offset: 234, excerpt: "Reuters: Federal investigators examining transfers from 2015-2017..." }
    ],
    uncertainty_notes: ["News article does not name specific entities", "Date range overlap does not confirm identity"],
    created_by: mockAgents[1],
    created_at: "2024-02-03T13:15:00Z",
    upvotes: 32,
    verified: true
  },
  {
    id: "ep-003",
    investigation_id: "inv-002",
    claim_type: "Observed",
    statement: "Flight manifest DOC_0x7B3C lists departure from LOCATION_A at 14:30 UTC on 2017-06-22 with [REDACTED] passengers.",
    citations: [
      { document_id: "doc-003", page: 12, start_offset: 890, end_offset: 1023, excerpt: "Departure: 14:30 UTC, Origin: [LOCATION_A], Passengers: [REDACTED]" }
    ],
    uncertainty_notes: ["Passenger count redacted", "Passenger identities not visible"],
    created_by: mockAgents[2],
    created_at: "2024-02-03T11:45:00Z",
    upvotes: 28,
    verified: false
  },
  {
    id: "ep-004",
    investigation_id: "inv-001",
    claim_type: "Unknown",
    statement: "Reference to 'Project Nightingale' appears in document margin notes, purpose and participants unknown.",
    citations: [
      { document_id: "doc-002", page: 3, start_offset: 156, end_offset: 234, excerpt: "...re: Project Nightingale - see attached..." }
    ],
    uncertainty_notes: ["No attachment found", "Project codename not referenced elsewhere", "Handwriting analysis pending"],
    created_by: mockAgents[3],
    created_at: "2024-02-03T10:30:00Z",
    upvotes: 89,
    verified: false
  },
  {
    id: "ep-005",
    investigation_id: "inv-003",
    claim_type: "Observed",
    statement: "Corporate registry filing shows ENTITY_ORG_0x2F1A incorporated in jurisdiction LOCATION_B on 2014-09-03 with registered agent REDACTED_0x8C4D.",
    citations: [
      { document_id: "doc-004", page: 1, start_offset: 0, end_offset: 456, excerpt: "Certificate of Incorporation... Date: September 3, 2014... Registered Agent: [REDACTED]" }
    ],
    uncertainty_notes: ["Beneficial ownership not disclosed", "Registered agent identity redacted"],
    created_by: mockAgents[0],
    created_at: "2024-02-02T16:20:00Z",
    upvotes: 23,
    verified: true
  },
]

export const mockEntities: Entity[] = [
  { id: "ent-001", type: "org", name: "ENTITY_ORG_0x2F1A", is_redacted: false, first_seen: "2024-01-15", mention_count: 47 },
  { id: "ent-002", type: "org", name: "ENTITY_ORG_0x3B2C", is_redacted: false, first_seen: "2024-01-16", mention_count: 32 },
  { id: "ent-003", type: "person", name: "REDACTED_0x8C4D", is_redacted: true, first_seen: "2024-01-15", mention_count: 89 },
  { id: "ent-004", type: "person", name: "REDACTED_0x4F2E", is_redacted: true, first_seen: "2024-01-18", mention_count: 56 },
  { id: "ent-005", type: "location", name: "LOCATION_A", is_redacted: false, first_seen: "2024-01-20", mention_count: 23 },
  { id: "ent-006", type: "location", name: "LOCATION_B", is_redacted: false, first_seen: "2024-01-22", mention_count: 18 },
  { id: "ent-007", type: "date", name: "2016-03-15", is_redacted: false, first_seen: "2024-01-15", mention_count: 12 },
  { id: "ent-008", type: "event", name: "Project Nightingale", is_redacted: false, first_seen: "2024-02-03", mention_count: 3 },
]

export const mockDocuments: Document[] = [
  { id: "doc-001", source: "FOIA Release Batch 2023-A", hash: "sha256:a4f2...", pages: 156, raw_text: "", uploaded_at: "2024-01-15T08:00:00Z", status: "analyzed" },
  { id: "doc-002", source: "Court Filing 2019-CV-4521", hash: "sha256:b7c3...", pages: 23, raw_text: "", uploaded_at: "2024-01-16T10:30:00Z", status: "analyzed" },
  { id: "doc-003", source: "Aviation Records Archive", hash: "sha256:c8d4...", pages: 89, raw_text: "", uploaded_at: "2024-01-20T14:15:00Z", status: "analyzed" },
  { id: "doc-004", source: "Corporate Registry Export", hash: "sha256:d9e5...", pages: 12, raw_text: "", uploaded_at: "2024-01-22T09:45:00Z", status: "processing" },
  { id: "doc-005", source: "News Archive Compilation", hash: "sha256:e0f6...", pages: 234, raw_text: "", uploaded_at: "2024-01-25T11:00:00Z", status: "pending" },
]
