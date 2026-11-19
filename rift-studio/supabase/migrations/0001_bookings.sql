-- RIFT Studio – system rezerwacji (Supabase / PostgreSQL 15+)
-- Uruchom w Supabase: SQL Editor → wklej → Run (albo `supabase db push`).
--
-- Ochrona przed podwójną rezerwacją jest w bazie: ograniczenie EXCLUDE na zakresie czasu
-- odrzuca każdą nakładającą się aktywną rezerwację, niezależnie od liczby instancji aplikacji.

create extension if not exists btree_gist;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  service text not null check (service in ('vocal', 'production', 'mix', 'podcast')),
  duration_min integer not null check (duration_min between 30 and 480),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 254),
  phone text not null default '',
  message text not null default '' check (char_length(message) <= 1500),
  sound text not null default '',
  lang text not null default 'pl' check (lang in ('pl', 'en')),
  token_hash text not null unique,
  cancel_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_time_order check (ends_at > starts_at),
  constraint bookings_no_overlap exclude using gist (tstzrange(starts_at, ends_at, '[)') with &&)
    where (status <> 'cancelled')
);

create index if not exists bookings_starts_at_idx on public.bookings (starts_at) where status <> 'cancelled';

create table if not exists public.booking_blocks (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  constraint booking_blocks_time_order check (ends_at > starts_at)
);

-- Dostęp wyłącznie z serwera aplikacji (klucz service_role). Brak polityk = brak dostępu dla anon/authenticated.
alter table public.bookings enable row level security;
alter table public.booking_blocks enable row level security;

-- Tworzenie rezerwacji: blokady sprawdzamy w tej samej transakcji, kolizje z rezerwacjami łapie EXCLUDE.
create or replace function public.create_booking(
  p_service text, p_duration_min integer, p_starts_at timestamptz, p_ends_at timestamptz,
  p_name text, p_email text, p_phone text, p_message text, p_sound text, p_lang text, p_token_hash text
) returns public.bookings
language plpgsql
security invoker
set search_path = public
as $$
declare
  result public.bookings;
begin
  -- serializacja względem dodawania blokad
  lock table public.booking_blocks in share mode;
  if exists (
    select 1 from public.booking_blocks b
    where tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(p_starts_at, p_ends_at, '[)')
  ) then
    raise exception 'slot_unavailable' using errcode = 'P0001';
  end if;

  insert into public.bookings (service, duration_min, starts_at, ends_at, name, email, phone, message, sound, lang, token_hash)
  values (p_service, p_duration_min, p_starts_at, p_ends_at, p_name, p_email, p_phone, p_message, p_sound, p_lang, p_token_hash)
  returning * into result;
  return result;
exception
  when exclusion_violation then
    raise exception 'slot_unavailable' using errcode = 'P0001';
end;
$$;

create or replace function public.reschedule_booking(p_id uuid, p_starts_at timestamptz, p_ends_at timestamptz)
returns public.bookings
language plpgsql
security invoker
set search_path = public
as $$
declare
  result public.bookings;
begin
  lock table public.booking_blocks in share mode;
  if exists (
    select 1 from public.booking_blocks b
    where tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(p_starts_at, p_ends_at, '[)')
  ) then
    raise exception 'slot_unavailable' using errcode = 'P0001';
  end if;

  update public.bookings
     set starts_at = p_starts_at, ends_at = p_ends_at, status = 'pending', updated_at = now()
   where id = p_id and status <> 'cancelled'
  returning * into result;

  if result.id is null then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  return result;
exception
  when exclusion_violation then
    raise exception 'slot_unavailable' using errcode = 'P0001';
end;
$$;

revoke all on function public.create_booking from public, anon, authenticated;
revoke all on function public.reschedule_booking from public, anon, authenticated;
grant execute on function public.create_booking to service_role;
grant execute on function public.reschedule_booking to service_role;
