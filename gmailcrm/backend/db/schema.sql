-- Supabase/Postgres schema for GmailCRM (Step 4)
-- Execute in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  google_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  email text not null,
  first_name text,
  last_name text,
  company text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, email)
);

create table if not exists pipelines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  name text not null,
  stage text not null default 'lead',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  pipeline_id uuid references pipelines(id) on delete set null,
  title text not null,
  value numeric not null default 0,
  currency text not null default 'USD',
  stage text not null default 'lead',
  status text not null default 'open',
  close_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists email_tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  contact_id uuid references contacts(id) on delete set null,
  subject text,
  pixel_token text not null unique,
  opens_count integer not null default 0,
  last_opened_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists tracked_links (
  id uuid primary key default gen_random_uuid(),
  email_track_id uuid references email_tracks(id) on delete cascade,
  link_token text not null unique,
  original_url text not null,
  clicks_count integer not null default 0,
  last_clicked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists mail_merge_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  name text not null,
  template_subject text,
  template_body text,
  status text not null default 'draft',
  sent_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contacts_user_id on contacts(user_id);
create index if not exists idx_deals_pipeline_id on deals(pipeline_id);
create index if not exists idx_email_tracks_token on email_tracks(pixel_token);
create index if not exists idx_tracked_links_token on tracked_links(link_token);
