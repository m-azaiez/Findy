insert into public.categories (id, name, slug, description)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Cafe',
    'cafe',
    'Coffee-focused places designed for lingering.'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Viewpoint',
    'viewpoint',
    'Scenic spots built around atmosphere and perspective.'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Gallery',
    'gallery',
    'Independent cultural spaces and creative venues.'
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description;

insert into public.places (
  id,
  slug,
  name,
  short_description,
  description,
  city,
  country,
  address,
  price_tier,
  average_rating,
  review_count,
  is_open_now,
  cover_image_url,
  tags,
  opening_hours
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'canal-house',
    'Canal House',
    'An all-day cafe built around warm light, long tables, and slow mornings.',
    'Canal House is designed like a neighborhood anchor: bright during the day, intimate after dusk, and relaxed enough to work, meet, or pause between errands.',
    'Montreal',
    'Canada',
    '127 Saint-Ambroise Street',
    'mid-range',
    4.7,
    128,
    true,
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    array['coffee', 'design-led', 'all-day'],
    '{
      "monday": "07:30 - 18:00",
      "tuesday": "07:30 - 18:00",
      "wednesday": "07:30 - 18:00",
      "thursday": "07:30 - 21:00",
      "friday": "07:30 - 21:00",
      "saturday": "08:00 - 21:00",
      "sunday": "08:00 - 18:00"
    }'::jsonb
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'belvedere-nord',
    'Belvedere Nord',
    'A panoramic terrace above the tree line with a quiet, cinematic skyline view.',
    'Belvedere Nord turns a standard lookout into a destination. The space is minimal, the sightlines are broad, and the atmosphere is deliberately calm.',
    'Quebec City',
    'Canada',
    '18 Panorama Avenue',
    'budget',
    4.8,
    86,
    true,
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
    array['sunset', 'scenic', 'outdoor'],
    '{
      "monday": "06:00 - 22:00",
      "tuesday": "06:00 - 22:00",
      "wednesday": "06:00 - 22:00",
      "thursday": "06:00 - 22:00",
      "friday": "06:00 - 23:00",
      "saturday": "06:00 - 23:00",
      "sunday": "06:00 - 22:00"
    }'::jsonb
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'atelier-rue-nord',
    'Atelier Rue Nord',
    'A small gallery with rotating installations, books, and a strong local point of view.',
    'Atelier Rue Nord mixes exhibition programming, a compact reading room, and a thoughtful shop. It is built for browsing, returning, and discovering new work without friction.',
    'Toronto',
    'Canada',
    '42 Mercer Street',
    'mid-range',
    4.5,
    41,
    false,
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
    array['art', 'independent', 'curated'],
    '{
      "monday": "Closed",
      "tuesday": "11:00 - 18:00",
      "wednesday": "11:00 - 18:00",
      "thursday": "11:00 - 19:00",
      "friday": "11:00 - 19:00",
      "saturday": "10:00 - 18:00",
      "sunday": "10:00 - 16:00"
    }'::jsonb
  )
on conflict (slug) do update
set
  name = excluded.name,
  short_description = excluded.short_description,
  description = excluded.description,
  city = excluded.city,
  country = excluded.country,
  address = excluded.address,
  price_tier = excluded.price_tier,
  average_rating = excluded.average_rating,
  review_count = excluded.review_count,
  is_open_now = excluded.is_open_now,
  cover_image_url = excluded.cover_image_url,
  tags = excluded.tags,
  opening_hours = excluded.opening_hours;

insert into public.place_categories (place_id, category_id)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333')
on conflict do nothing;
