alter table public.reviews
drop constraint if exists reviews_rating_check;

alter table public.reviews
alter column rating type numeric(2,1)
using rating::numeric(2,1);

alter table public.reviews
add constraint reviews_rating_check
check (
  rating >= 0.5
  and rating <= 5.0
  and mod((rating * 10)::integer, 5) = 0
);
