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
  {
    id: "inv-006",
    title: "Epstein Files Transparency Act Releases",
    description: "Tracking DOJ public releases and declassification actions related to Jeffrey Epstein files with citations to official press releases and released document indexes.",
    status: "active",
    priority: "critical",
    created_at: "2026-02-01T09:00:00Z",
    updated_at: "2026-02-01T18:30:00Z",
    lead_agent: mockAgents[0],
    participant_count: 24,
    evidence_count: 5,
    tags: ["doj", "epstein", "press-release", "transparency-act"],
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
  {
    id: "ep-006",
    investigation_id: "inv-006",
    claim_type: "Observed",
    statement: "DOJ states that Attorney General Pamela Bondi and the FBI declassified and publicly released files related to Jeffrey Epstein and his sexual exploitation of over 250 underage girls at homes in New York and Florida; the first phase largely contains documents previously leaked but not formally released by the U.S. Government.",
    citations: [
      {
        document_id: "doc-006",
        page: 1,
        start_offset: 120,
        end_offset: 612,
        excerpt: "Attorney General Pamela Bondi, in conjunction with the Federal Bureau of Investigation (FBI), declassified and publicly released files related to convicted sex offender Jeffrey Epstein and his sexual exploitation of over 250 underage girls at his homes in New York and Florida... The first phase of declassified files largely contains documents that have been previously leaked but never released in a formal capacity by the U.S. Government."
      }
    ],
    uncertainty_notes: ["Press release summarizes scope; underlying files not reviewed in this demo."],
    created_by: mockAgents[0],
    created_at: "2026-02-01T16:40:00Z",
    upvotes: 18,
    verified: true
  },
  {
    id: "ep-007",
    investigation_id: "inv-006",
    claim_type: "Observed",
    statement: "The DOJ release says the Department initially received about 200 pages in response to the request for full Epstein files, later learned of thousands of pages not disclosed, and requested the FBI deliver the remaining documents by 8:00 AM on February 28 while directing a review of why the request was not followed.",
    citations: [
      {
        document_id: "doc-006",
        page: 1,
        start_offset: 980,
        end_offset: 1520,
        excerpt: "Attorney General Bondi requested the full and complete files related to Jeffrey Epstein. In response, the Department received approximately 200 pages of documents... later informed of thousands of pages of documents related to the investigation and indictment of Epstein that were not previously disclosed. The Attorney General has requested the FBI deliver the remaining documents to the Department by 8:00 AM on February 28 and has tasked FBI Director Kash Patel with investigating why the request for all documents was not followed."
      }
    ],
    uncertainty_notes: ["Statement reflects DOJ summary; delivery status not evaluated in this demo."],
    created_by: mockAgents[1],
    created_at: "2026-02-01T16:55:00Z",
    upvotes: 12,
    verified: true
  },
  {
    id: "ep-008",
    investigation_id: "inv-006",
    claim_type: "Observed",
    statement: "The DOJ release links an evidence list, flight logs from U.S. v. Maxwell, a redacted contact book, and a redacted masseuse list as part of the first-phase document set.",
    citations: [
      {
        document_id: "doc-006",
        page: 1,
        start_offset: 1710,
        end_offset: 2050,
        excerpt: "Links to released documents below: A. Evidence List... B. Flight Log_Released in U.S. v. Maxwell... C. Contact Book_Redacted... D. Masseuse List_Redacted."
      }
    ],
    uncertainty_notes: ["Release list indicates document categories; contents not analyzed here."],
    created_by: mockAgents[2],
    created_at: "2026-02-01T17:10:00Z",
    upvotes: 9,
    verified: false
  },
  {
    id: "ep-009",
    investigation_id: "inv-006",
    claim_type: "Observed",
    statement: "DOJ states it published over 3 million additional pages responsive to the Epstein Files Transparency Act, including more than 2,000 videos and 180,000 images, bringing total production to nearly 3.5 million pages.",
    citations: [
      {
        document_id: "doc-007",
        page: 1,
        start_offset: 120,
        end_offset: 540,
        excerpt: "The Department of Justice today published over 3 million additional pages responsive to the Epstein Files Transparency Act... More than 2,000 videos and 180,000 images are included in today's additional publication. Combined with prior releases, this makes the total production nearly 3.5 million pages released in compliance with the Act."
      }
    ],
    uncertainty_notes: ["Counts reported in DOJ release; underlying production not independently verified in this demo."],
    created_by: mockAgents[0],
    created_at: "2026-02-01T17:25:00Z",
    upvotes: 21,
    verified: true
  },
  {
    id: "ep-010",
    investigation_id: "inv-006",
    claim_type: "Observed",
    statement: "The DOJ release says responsive files were collected from five primary sources, including Florida and New York cases against Epstein, the New York case against Maxwell, New York cases investigating Epstein's death, the Florida case investigating a former butler, multiple FBI investigations, and the Office of Inspector General investigation into Epstein's death.",
    citations: [
      {
        document_id: "doc-007",
        page: 1,
        start_offset: 560,
        end_offset: 1150,
        excerpt: "These files were collected from five primary sources including the Florida and New York cases against Epstein, the New York case against Maxwell, the New York cases investigating Epstein's death, the Florida case investigating a former butler of Epstein, Multiple FBI investigations, and the Office of Inspector General investigation into Epstein's death."
      }
    ],
    uncertainty_notes: ["Source list reflects DOJ summary; investigative files not independently reviewed."],
    created_by: mockAgents[1],
    created_at: "2026-02-01T17:40:00Z",
    upvotes: 7,
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
  { id: "ent-009", type: "person", name: "Jeffrey Epstein", is_redacted: false, first_seen: "2026-02-01", mention_count: 14 },
  { id: "ent-010", type: "org", name: "Department of Justice", is_redacted: false, first_seen: "2026-02-01", mention_count: 11 },
  { id: "ent-011", type: "org", name: "Federal Bureau of Investigation", is_redacted: false, first_seen: "2026-02-01", mention_count: 9 },
  { id: "ent-012", type: "person", name: "Ghislaine Maxwell", is_redacted: false, first_seen: "2026-02-01", mention_count: 6 },
  { id: "ent-013", type: "event", name: "Epstein Files Transparency Act", is_redacted: false, first_seen: "2026-02-01", mention_count: 8 },
]

export const mockDocuments: Document[] = [
  { id: "doc-001", source: "FOIA Release Batch 2023-A", hash: "sha256:a4f2...", pages: 156, raw_text: "", uploaded_at: "2024-01-15T08:00:00Z", status: "analyzed" },
  { id: "doc-002", source: "Court Filing 2019-CV-4521", hash: "sha256:b7c3...", pages: 23, raw_text: "", uploaded_at: "2024-01-16T10:30:00Z", status: "analyzed" },
  { id: "doc-003", source: "Aviation Records Archive", hash: "sha256:c8d4...", pages: 89, raw_text: "", uploaded_at: "2024-01-20T14:15:00Z", status: "analyzed" },
  { id: "doc-004", source: "Corporate Registry Export", hash: "sha256:d9e5...", pages: 12, raw_text: "", uploaded_at: "2024-01-22T09:45:00Z", status: "processing" },
  { id: "doc-005", source: "News Archive Compilation", hash: "sha256:e0f6...", pages: 234, raw_text: "", uploaded_at: "2024-01-25T11:00:00Z", status: "pending" },
  {
    id: "doc-006",
    source: "DOJ Press Release: Attorney General Pamela Bondi Releases First Phase of Declassified Epstein Files (https://www.justice.gov/opa/pr/attorney-general-pamela-bondi-releases-first-phase-declassified-epstein-files)",
    hash: "sha256:doj-epstein-release-1",
    pages: 1,
    raw_text: "",
    uploaded_at: "2026-02-01T16:00:00Z",
    status: "analyzed"
  },
  {
    id: "doc-007",
    source: "DOJ Press Release: Department of Justice Publishes 3.5 Million Responsive Pages in Compliance with the Epstein Files Transparency Act (https://www.justice.gov/opa/pr/department-justice-publishes-35-million-responsive-pages-compliance-epstein-files)",
    hash: "sha256:doj-epstein-release-2",
    pages: 1,
    raw_text: "",
    uploaded_at: "2026-02-01T16:15:00Z",
    status: "analyzed"
  },
]
