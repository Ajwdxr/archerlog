-- ARROWLOG v1 — Initial Database Schema
-- Run this migration in Supabase SQL Editor

-- ═══════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════

-- Communities
create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  location text,
  logo_url text,
  created_at timestamptz default now()
);

-- Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  bow_type text,
  created_at timestamptz default now()
);

-- Community Members
create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references public.communities(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text default 'member' check (role in ('member', 'organizer', 'admin')),
  created_at timestamptz default now(),
  unique(community_id, user_id)
);

-- Sessions
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  community_id uuid references public.communities(id),
  name text not null,
  venue text,
  session_date date not null,
  start_time time,
  bow_type text,
  distance_m numeric,
  ends_count integer not null check (ends_count > 0),
  arrows_per_end integer not null check (arrows_per_end > 0),
  maximum_arrow_score integer default 10,
  status text default 'draft' check (status in ('draft', 'open', 'live', 'completed', 'cancelled')),
  join_code text unique not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Session Archers (participants in a session)
create table if not exists public.session_archers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  user_id uuid references public.profiles(id),
  display_name text not null,
  bow_type text,
  joined_at timestamptz default now(),
  unique(session_id, user_id)
);

-- Ends (score groups per archer per end)
create table if not exists public.ends (
  id uuid primary key default gen_random_uuid(),
  session_archer_id uuid references public.session_archers(id) on delete cascade,
  end_number integer not null check (end_number > 0),
  total_score integer default 0,
  submitted_at timestamptz,
  unique(session_archer_id, end_number)
);

-- Arrows (individual arrow scores)
create table if not exists public.arrows (
  id uuid primary key default gen_random_uuid(),
  end_id uuid references public.ends(id) on delete cascade,
  arrow_number integer not null check (arrow_number > 0),
  display_value text not null,
  numeric_value integer not null check (numeric_value >= 0),
  created_at timestamptz default now(),
  unique(end_id, arrow_number)
);

-- Results (snapshot after session completion)
create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  session_archer_id uuid references public.session_archers(id),
  total_score integer not null,
  total_arrows integer not null,
  average_score numeric(6,2),
  x_count integer default 0,
  ten_count integer default 0,
  rank integer,
  created_at timestamptz default now()
);

-- Posters (generated result images)
create table if not exists public.posters (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  session_archer_id uuid references public.session_archers(id),
  poster_type text not null check (poster_type in ('individual', 'session')),
  template text,
  image_url text,
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════

create index if not exists idx_sessions_join_code on public.sessions(join_code);
create index if not exists idx_sessions_status on public.sessions(status);
create index if not exists idx_sessions_created_by on public.sessions(created_by);
create index if not exists idx_session_archers_session on public.session_archers(session_id);
create index if not exists idx_session_archers_user on public.session_archers(user_id);
create index if not exists idx_ends_session_archer on public.ends(session_archer_id);
create index if not exists idx_arrows_end on public.arrows(end_id);
create index if not exists idx_results_session on public.results(session_id);

-- ═══════════════════════════════════════
-- AUTO-PROFILE ON SIGNUP
-- ═══════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop if exists to allow re-run
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ═══════════════════════════════════════
-- AUTO-UPDATE updated_at ON SESSIONS
-- ═══════════════════════════════════════

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists sessions_updated_at on public.sessions;
create trigger sessions_updated_at
  before update on public.sessions
  for each row execute procedure public.handle_updated_at();

-- ═══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.sessions enable row level security;
alter table public.session_archers enable row level security;
alter table public.ends enable row level security;
alter table public.arrows enable row level security;
alter table public.results enable row level security;
alter table public.posters enable row level security;

-- Profiles: users can read all profiles, update own
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Communities: readable by everyone
create policy "Communities are viewable by everyone" on public.communities for select using (true);

-- Sessions: readable by everyone (for join flow), writable by creator
create policy "Sessions are viewable by everyone" on public.sessions for select using (true);
create policy "Authenticated users can create sessions" on public.sessions for insert with check (auth.uid() = created_by);
create policy "Session creators can update" on public.sessions for update using (auth.uid() = created_by);

-- Session archers: readable by session participants, insertable by anyone (guest join)
create policy "Session archers viewable by everyone" on public.session_archers for select using (true);
create policy "Anyone can join a session" on public.session_archers for insert with check (true);

-- Ends: readable by session participants
create policy "Ends are viewable by everyone" on public.ends for select using (true);
create policy "Session archers can insert ends" on public.ends for insert with check (true);
create policy "Session archers can update own ends" on public.ends for update using (true);

-- Arrows: readable by everyone, insertable by participants
create policy "Arrows are viewable by everyone" on public.arrows for select using (true);
create policy "Participants can insert arrows" on public.arrows for insert with check (true);
create policy "Participants can update arrows" on public.arrows for update using (true);

-- Results: readable by everyone
create policy "Results are viewable by everyone" on public.results for select using (true);
create policy "System can insert results" on public.results for insert with check (true);

-- Posters: readable by everyone
create policy "Posters are viewable by everyone" on public.posters for select using (true);
create policy "System can insert posters" on public.posters for insert with check (true);

-- Community members
create policy "Community members viewable by everyone" on public.community_members for select using (true);
create policy "Admins can manage members" on public.community_members for insert with check (true);

-- ═══════════════════════════════════════
-- REALTIME
-- ═══════════════════════════════════════

-- Enable realtime for leaderboard and session status
alter publication supabase_realtime add table public.ends;
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.session_archers;
