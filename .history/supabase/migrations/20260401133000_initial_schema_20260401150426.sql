create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'user_role'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.user_role as enum ('user', 'admin');
  end if;

  if not exists (
    select 1
    from pg_type
    where typname = 'price_tier'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.price_tier as enum ('budget', 'mid-range', 'premium', 'luxury');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  city text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null,
  description text not null,
  city text not null,
  country text not null default 'Canada',
  address text not null,
  price_tier public.price_tier not null default 'mid-range',
  average_rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  is_open_now boolean not null default false,
  cover_image_url text,
  gallery text[] not null default '{}',
  tags text[] not null default '{}',
  opening_hours jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.place_categories (
  place_id uuid not null references public.places (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (place_id, category_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (place_id, user_id)
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  place_id uuid not null references public.places (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, place_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = coalesce(uid, auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.sync_place_rating()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  target_place_id uuid;
begin
  target_place_id := coalesce(new.place_id, old.place_id);

  update public.places
  set
    average_rating = coalesce((
      select round(avg(rating)::numeric, 1)
      from public.reviews
      where place_id = target_place_id
    ), 0),
    review_count = (
      select count(*)
      from public.reviews
      where place_id = target_place_id
    )::integer,
    updated_at = timezone('utc', now())
  where id = target_place_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

drop trigger if exists places_set_updated_at on public.places;
create trigger places_set_updated_at
  before update on public.places
  for each row
  execute function public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row
  execute function public.set_updated_at();

drop trigger if exists reviews_sync_place_rating on public.reviews;
create trigger reviews_sync_place_rating
  after insert or update or delete on public.reviews
  for each row
  execute function public.sync_place_rating();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.places enable row level security;
alter table public.place_categories enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;

drop policy if exists "profiles_select_public" on public.profiles;
create policy "profiles_select_public"
  on public.profiles
  for select
  using (true);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public"
  on public.categories
  for select
  using (true);

drop policy if exists "categories_manage_admin" on public.categories;
create policy "categories_manage_admin"
  on public.categories
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "places_select_public" on public.places;
create policy "places_select_public"
  on public.places
  for select
  using (true);

drop policy if exists "places_manage_admin" on public.places;
create policy "places_manage_admin"
  on public.places
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "place_categories_select_public" on public.place_categories;
create policy "place_categories_select_public"
  on public.place_categories
  for select
  using (true);

drop policy if exists "place_categories_manage_admin" on public.place_categories;
create policy "place_categories_manage_admin"
  on public.place_categories
  for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "reviews_select_public" on public.reviews;
create policy "reviews_select_public"
  on public.reviews
  for select
  using (true);

drop policy if exists "reviews_insert_self" on public.reviews;
create policy "reviews_insert_self"
  on public.reviews
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "reviews_update_owner_or_admin" on public.reviews;
create policy "reviews_update_owner_or_admin"
  on public.reviews
  for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "reviews_delete_owner_or_admin" on public.reviews;
create policy "reviews_delete_owner_or_admin"
  on public.reviews
  for delete
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own"
  on public.favorites
  for select
  using (auth.uid() = user_id);

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own"
  on public.favorites
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own"
  on public.favorites
  for delete
  using (auth.uid() = user_id);
