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

drop trigger if exists reviews_sync_place_rating on public.reviews;
create trigger reviews_sync_place_rating
  after insert or update or delete on public.reviews
  for each row
  execute function public.sync_place_rating();
