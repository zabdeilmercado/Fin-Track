-- Run in the Supabase SQL editor before deploying. Safe to rerun; existing records are preserved.
begin;
create table if not exists public.finance_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{"accounts":[],"transactions":[],"categories":[],"budgets":[],"goals":[]}'::jsonb,
  version integer not null default 1 check (version > 0),
  constraint payload_collections check (
    payload ?& array['accounts', 'transactions', 'categories'] and
    jsonb_typeof(payload->'accounts') = 'array' and
    jsonb_typeof(payload->'transactions') = 'array' and
    jsonb_typeof(payload->'categories') = 'array'
  )
);
alter table public.finance_state enable row level security;
revoke all on public.finance_state from anon;
grant select, insert, update, delete on public.finance_state to authenticated;
drop policy if exists "Read own finances" on public.finance_state;
create policy "Read own finances" on public.finance_state for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Insert own finances" on public.finance_state;
create policy "Insert own finances" on public.finance_state for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Update own finances" on public.finance_state;
create policy "Update own finances" on public.finance_state for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Delete own finances" on public.finance_state;
create policy "Delete own finances" on public.finance_state for delete to authenticated using ((select auth.uid()) = user_id);


commit;

