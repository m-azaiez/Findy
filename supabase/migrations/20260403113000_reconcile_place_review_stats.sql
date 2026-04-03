update public.places as places
set
  average_rating = stats.average_rating,
  review_count = stats.review_count,
  updated_at = timezone('utc', now())
from (
  select
    place.id,
    coalesce(round(avg(review.rating)::numeric, 1), 0) as average_rating,
    count(review.id)::integer as review_count
  from public.places as place
  left join public.reviews as review on review.place_id = place.id
  group by place.id
) as stats
where places.id = stats.id;
