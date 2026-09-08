-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Stores one generated plan per user, readable/writable only by its owner.

create table if not exists public.plans (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.plans enable row level security;

create policy "Users can view their own plan"
  on public.plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own plan"
  on public.plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own plan"
  on public.plans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own plan"
  on public.plans for delete
  using (auth.uid() = user_id);
