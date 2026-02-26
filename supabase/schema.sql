-- ============================================
-- Pomo Room - Database Schema
-- Supabase SQL Editor에서 실행하세요!
-- ============================================

-- 1. profiles 테이블 (유저 프로필)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text not null default '',
  avatar_url text not null default '',
  coins integer not null default 0,
  total_pomodoros integer not null default 0,
  total_focus_minutes integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_pomodoro_date date,
  is_room_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. user_rooms 테이블 (방 커스터마이즈)
create table if not exists public.user_rooms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  theme text not null default 'default',
  owned_item_ids text[] not null default '{}',
  active_item_ids text[] not null default '{}',
  item_positions jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. pomodoro_sessions 테이블 (세션 기록)
create table if not exists public.pomodoro_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  session_type text not null default 'focus',
  duration_minutes integer not null,
  completed_at timestamptz not null default now()
);

-- 4. daily_stats 테이블 (일별 통계 캐시)
create table if not exists public.daily_stats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  day date not null,
  count integer not null default 0,
  minutes integer not null default 0,
  unique(user_id, day)
);

-- ============================================
-- Indexes
-- ============================================
create index if not exists idx_pomodoro_sessions_user on public.pomodoro_sessions(user_id);
create index if not exists idx_pomodoro_sessions_completed on public.pomodoro_sessions(completed_at);
create index if not exists idx_daily_stats_user_day on public.daily_stats(user_id, day);

-- ============================================
-- Auto-create profile on signup (trigger)
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- Auto-update updated_at
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

drop trigger if exists user_rooms_updated_at on public.user_rooms;
create trigger user_rooms_updated_at
  before update on public.user_rooms
  for each row execute procedure public.update_updated_at();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- profiles: 누구나 읽기 가능, 본인만 수정
alter table public.profiles enable row level security;

create policy "profiles_select" on public.profiles
  for select using (true);

create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id);

-- user_rooms: 공개 방은 읽기 가능, 본인만 수정
alter table public.user_rooms enable row level security;

create policy "rooms_select" on public.user_rooms
  for select using (true);

create policy "rooms_insert" on public.user_rooms
  for insert with check (auth.uid() = user_id);

create policy "rooms_update" on public.user_rooms
  for update using (auth.uid() = user_id);

-- pomodoro_sessions: 본인만 읽기/쓰기
alter table public.pomodoro_sessions enable row level security;

create policy "sessions_select" on public.pomodoro_sessions
  for select using (auth.uid() = user_id);

create policy "sessions_insert" on public.pomodoro_sessions
  for insert with check (auth.uid() = user_id);

-- daily_stats: 본인만 읽기/쓰기
alter table public.daily_stats enable row level security;

create policy "daily_stats_select" on public.daily_stats
  for select using (auth.uid() = user_id);

create policy "daily_stats_insert" on public.daily_stats
  for insert with check (auth.uid() = user_id);

create policy "daily_stats_update" on public.daily_stats
  for update using (auth.uid() = user_id);
