-- ==========================================
-- SWIFT TICKET SYSTEM - DATABASE SCHEMA
-- Corrected + safer idempotent run
-- ==========================================

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- Drop existing policies (safe to run even if they don't exist)
drop policy if exists "Allow public read-only access to profiles" on public.profiles;
drop policy if exists "Allow users to update their own profiles" on public.profiles;

drop policy if exists "Allow authenticated users to read tickets" on public.tickets;
drop policy if exists "Allow users to insert tickets" on public.tickets;
drop policy if exists "Allow users to update tickets" on public.tickets;

drop policy if exists "Allow public read access to knowledge_base" on public.knowledge_base;
drop policy if exists "Allow authenticated users to modify knowledge_base" on public.knowledge_base;

-- Drop existing trigger and function (if any)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 1. profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text default 'user',
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Allow public read-only access to profiles" on public.profiles
  for select using (true);

create policy "Allow users to update their own profiles" on public.profiles
  for update
  using (auth.uid() = id);

-- 2. Trigger function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'user'),
    upper(substring(coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)) from 1 for 2))
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. tickets table
create table if not exists public.tickets (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text,
  priority text,
  status text default 'open',
  submitted_by uuid references public.profiles(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tracking_number text,
  first_name text,
  last_name text,
  email text,
  phone text,
  registration_number text,
  location text,
  resolution text,
  technician_comments text,
  resolved_at timestamp with time zone
);

alter table public.tickets enable row level security;

-- Read: authenticated users only
create policy "Allow authenticated users to read tickets" on public.tickets
  for select
  to authenticated
  using (true);

-- Insert: owned-only (submitted_by must be the caller)
create policy "Allow users to insert tickets" on public.tickets
  for insert
  to authenticated
  with check (auth.uid() = submitted_by);

-- Update: Owned OR assigned
-- USING limits which existing rows can be targeted;
-- WITH CHECK limits what the updated row may contain.
create policy "Allow users to update tickets" on public.tickets
  for update
  to authenticated
  using (auth.uid() = submitted_by OR auth.uid() = assigned_to)
  with check (auth.uid() = submitted_by OR auth.uid() = assigned_to);

-- 4. knowledge_base table
create table if not exists public.knowledge_base (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text,
  views integer default 0,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.knowledge_base enable row level security;

-- Add a unique constraint so ON CONFLICT works deterministically
create unique index if not exists knowledge_base_title_key
  on public.knowledge_base(title);

create policy "Allow public read access to knowledge_base" on public.knowledge_base
  for select
  to anon
  using (true);

create policy "Allow authenticated users to modify knowledge_base" on public.knowledge_base
  for all
  to authenticated
  using (true)
  with check (true);

-- 5. Seed knowledge base articles
insert into public.knowledge_base (title, category, views, content) values
  ('How to reset your password', 'Account', 1240, 'Go to the login page and click "Forgot password"…'),
  ('Connecting to the VPN', 'Network', 980, 'Download the VPN client from the IT portal…'),
  ('Setting up Multi-Factor Auth', 'Security', 765, 'Install the authenticator app and scan the QR code…'),
  ('Requesting new hardware', 'Hardware', 432, 'Submit a ticket under the Hardware category…')
on conflict (title) do update
set category = excluded.category,
    views = excluded.views,
    content = excluded.content;
