-- Table to store voice note metadata
create table if not exists public.voice_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null, -- e.g., recordings/<user_id>/<id>.m4a
  duration_seconds integer,
  status text not null default 'open' check (status in ('open','completed')),
  created_at timestamptz not null default now()
);

-- Helpful index
create index if not exists voice_notes_user_created_idx
  on public.voice_notes (user_id, created_at desc);

