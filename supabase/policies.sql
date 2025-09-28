alter table public.voice_notes enable row level security;

create policy "Select own notes"
  on public.voice_notes
  for select
  using (auth.uid() = user_id);

create policy "Insert own notes"
  on public.voice_notes
  for insert
  with check (auth.uid() = user_id);

create policy "Update own notes"
  on public.voice_notes
  for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Delete own notes"
  on public.voice_notes
  for delete
  using (auth.uid() = user_id);

-- In Storage policies, for bucket 'recordings'
-- Allow users to upload and read only their own files (by path prefix)
create policy "Users can upload their files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'recordings' and
    starts_with(name, 'recordings/' || auth.uid() || '/')
  );

create policy "Users can read their files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'recordings' and
    starts_with(name, 'recordings/' || auth.uid() || '/')
  );

