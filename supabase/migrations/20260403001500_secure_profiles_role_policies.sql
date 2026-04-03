create or replace function public.guard_profile_role_assignment()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if coalesce(new.role, 'user'::public.user_role) <> 'user'::public.user_role
       and not public.is_admin(auth.uid()) then
      raise exception 'Only admins can assign elevated profile roles';
    end if;

    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.role is distinct from old.role
       and not public.is_admin(auth.uid()) then
      raise exception 'Only admins can change profile roles';
    end if;

    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_guard_role_assignment on public.profiles;
create trigger profiles_guard_role_assignment
  before insert or update on public.profiles
  for each row
  execute function public.guard_profile_role_assignment();

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self_user"
  on public.profiles
  for insert
  with check (
    auth.uid() = id
    and coalesce(role, 'user'::public.user_role) = 'user'::public.user_role
  );

drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin"
  on public.profiles
  for insert
  with check (public.is_admin());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
  on public.profiles
  for update
  using (public.is_admin())
  with check (public.is_admin());
