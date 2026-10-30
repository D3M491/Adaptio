-- Votes of the workouts. Run it once in the Supabase dashboard: SQL Editor > New query > Run.
-- Safe to run again: it only creates what is missing.

create table if not exists public.ratings (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  workout_id text not null check (char_length(workout_id) between 1 and 64),
  stars smallint not null check (stars between 1 and 5),
  updated_at timestamptz not null default now(),
  -- One vote per person for each workout
  primary key (user_id, workout_id)
);

alter table public.ratings enable row level security;

-- Everybody can read and change only their own votes
drop policy if exists "read own votes" on public.ratings;
create policy "read own votes" on public.ratings
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "insert own votes" on public.ratings;
create policy "insert own votes" on public.ratings
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "update own votes" on public.ratings;
create policy "update own votes" on public.ratings
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "delete own votes" on public.ratings;
create policy "delete own votes" on public.ratings
  for delete to authenticated using (user_id = auth.uid());

-- The totals everybody sees. They are computed here, the app cannot write them.
-- score weighs the average with the number of votes (as if every workout started with 5 votes
-- of 3.5), so one single 5 does not win over 200 votes around 4.7.
create or replace view public.workout_ratings as
  select
    workout_id,
    round(avg(stars)::numeric, 1)::float8 as average,
    count(*)::int as votes,
    ((count(*) * avg(stars) + 5 * 3.5) / (count(*) + 5))::float8 as score
  from public.ratings
  group by workout_id;

-- The app can only do what is granted here (anonymous users are "authenticated" too)
revoke all on public.ratings from anon, authenticated;
grant select, insert, update, delete on public.ratings to authenticated;
revoke all on public.workout_ratings from anon, authenticated;
grant select on public.workout_ratings to anon, authenticated;
