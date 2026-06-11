-- Выполните этот SQL в Supabase → SQL Editor

create table store_state (
  id          int primary key default 1,
  state       jsonb not null,
  updated_at  timestamptz default now()
);

-- Разрешаем чтение и запись без авторизации (anon key)
alter table store_state enable row level security;

create policy "allow read"  on store_state for select using (true);
create policy "allow write" on store_state for insert with check (true);
create policy "allow update" on store_state for update using (true);
