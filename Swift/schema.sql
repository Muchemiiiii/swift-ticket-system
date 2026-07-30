-- ==========================================
-- SWIFT TICKET SYSTEM - DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  role text default 'user',
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Allow public read-only access to profiles" on public.profiles
  for select using (true);

create policy "Allow users to update their own profiles" on public.profiles
  for update using (auth.uid() = id);

-- 2. Trigger function to auto-sync profiles from auth.users on signup
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
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to fire after auth.users insertion
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Create tickets table
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
  resolution text
);

-- Enable Row Level Security
alter table public.tickets enable row level security;

-- Policies for tickets
create policy "Allow authenticated users to read tickets" on public.tickets
  for select using (auth.role() = 'authenticated');

create policy "Allow users to insert tickets" on public.tickets
  for insert with check (auth.uid() = submitted_by);

create policy "Allow users to update tickets" on public.tickets
  for update using (auth.role() = 'authenticated');

-- 4. Create knowledge base table
create table if not exists public.knowledge_base (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text,
  views integer default 0,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.knowledge_base enable row level security;

-- Policies for knowledge base
create policy "Allow public read access to knowledge_base" on public.knowledge_base
  for select using (true);

create policy "Allow authenticated users to modify knowledge_base" on public.knowledge_base
  for all using (auth.role() = 'authenticated');

-- 5. Seed knowledge base articles
insert into public.knowledge_base (title, category, views, content) values
  ('How to reset your password', 'Account', 1240, 'Go to the login page and click "Forgot password"…'),
  ('Connecting to the VPN', 'Network', 980, 'Download the VPN client from the IT portal…'),
  ('Setting up Multi-Factor Auth', 'Security', 765, 'Install the authenticator app and scan the QR code…'),
  ('Requesting new hardware', 'Hardware', 432, 'Submit a ticket under the Hardware category…')
on conflict do nothing;
