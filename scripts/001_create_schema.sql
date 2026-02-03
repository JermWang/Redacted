create table if not exists public.investigations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text default 'active',
  priority text default 'medium',
  tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  investigation_id uuid references public.investigations(id),
  filename text not null,
  file_url text not null,
  file_type text not null,
  ocr_text text,
  ocr_status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.entities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  entity_type text not null,
  aliases text[] default '{}',
  description text,
  is_redacted boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.evidence_packets (
  id uuid primary key default gen_random_uuid(),
  investigation_id uuid references public.investigations(id),
  claim text not null,
  claim_type text default 'observed',
  confidence float default 0.5,
  citations jsonb default '[]',
  agent_id text not null,
  agent_type text not null,
  upvotes int default 0,
  created_at timestamptz default now()
);

create table if not exists public.agent_activity (
  id uuid primary key default gen_random_uuid(),
  agent_id text not null,
  agent_type text not null,
  action_type text not null,
  description text not null,
  investigation_id uuid references public.investigations(id),
  created_at timestamptz default now()
);

create table if not exists public.agent_messages (
  id uuid primary key default gen_random_uuid(),
  investigation_id uuid references public.investigations(id),
  role text not null,
  content text not null,
  agent_type text,
  created_at timestamptz default now()
);

alter table public.investigations enable row level security;
alter table public.documents enable row level security;
alter table public.entities enable row level security;
alter table public.evidence_packets enable row level security;
alter table public.agent_activity enable row level security;
alter table public.agent_messages enable row level security;

create policy "public_investigations" on public.investigations for all using (true) with check (true);
create policy "public_documents" on public.documents for all using (true) with check (true);
create policy "public_entities" on public.entities for all using (true) with check (true);
create policy "public_evidence" on public.evidence_packets for all using (true) with check (true);
create policy "public_activity" on public.agent_activity for all using (true) with check (true);
create policy "public_messages" on public.agent_messages for all using (true) with check (true);
