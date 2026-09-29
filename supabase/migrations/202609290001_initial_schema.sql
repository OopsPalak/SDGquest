create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'teacher', 'parent');
create type public.submission_status as enum (
  'pending', 'needs_resubmission', 'approved', 'rejected', 'likely_authentic', 'suspicious', 'review_required'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  full_name text not null check (char_length(full_name) between 1 and 100),
  email text not null,
  role public.app_role not null,
  email_verified boolean not null default false,
  grade text,
  class_name text,
  child_invite_code text unique default encode(gen_random_bytes(12), 'hex'),
  avatar jsonb not null default '{}'::jsonb,
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level between 1 and 5),
  streak integer not null default 0 check (streak >= 0),
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  invite_code text not null unique default encode(gen_random_bytes(12), 'hex'),
  created_at timestamptz not null default now()
);

create table public.class_students (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

create table public.parent_child_links (
  parent_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (parent_id, student_id)
);

create table public.missions (
  id text primary key default gen_random_uuid()::text,
  created_by uuid references public.profiles(id) on delete set null,
  class_id uuid references public.classes(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '',
  sdg_number smallint not null check (sdg_number between 1 and 17),
  xp_reward smallint not null default 50 check (xp_reward between 1 and 100),
  badge_name text not null default '',
  badge_id text,
  badge_icon text not null default '⭐',
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  mission_id text not null references public.missions(id) on delete restrict,
  submission_type text not null default 'photo' check (submission_type in ('photo', 'drawing', 'text')),
  presentation jsonb not null default '{}'::jsonb,
  evidence_path text,
  caption text not null default '' check (char_length(caption) <= 2000),
  status public.submission_status not null default 'pending',
  content_sha256 text,
  perceptual_hash text,
  image_screening jsonb not null default '{}'::jsonb,
  reviewed_by uuid references public.profiles(id) on delete set null,
  review_comment text not null default '',
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  created_at timestamptz not null default now()
);

create unique index one_active_submission_per_student_mission
on public.submissions (student_id, mission_id)
where status not in ('rejected', 'needs_resubmission');

create table public.badges (
  id text primary key,
  name text not null,
  description text not null default ''
);

create table public.user_badges (
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table public.quiz_questions (
  id text primary key,
  quiz_id text not null,
  question text not null,
  choices jsonb not null,
  answer_key text not null
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.user_quiz_rewards (
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null,
  awarded_at timestamptz not null default now(),
  primary key (user_id, quiz_id)
);

create table public.sdg_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  sdg_number smallint not null check (sdg_number between 1 and 17),
  progress integer not null default 0 check (progress between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, sdg_number)
);

create table public.book_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  submission_id uuid unique references public.submissions(id) on delete cascade,
  mission_id text not null references public.missions(id) on delete restrict,
  sdg_number smallint not null check (sdg_number between 1 and 17),
  title text not null,
  caption text not null default '',
  frame_id text not null default 'water',
  stickers jsonb not null default '[]'::jsonb,
  xp_earned integer not null default 0 check (xp_earned >= 0),
  badge_name text not null default '',
  badge_icon text not null default '',
  created_at timestamptz not null default now()
);

create table public.virtual_planet_progress (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  progress integer not null default 0 check (progress between 0 and 100),
  updated_at timestamptz not null default now()
);

create table public.summer_completions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  day smallint not null check (day between 1 and 30),
  completed_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table public.family_missions (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  status text not null default 'available' check (status in ('available', 'completed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.teacher_invites (
  code_hash text primary key,
  created_by uuid references auth.users(id) on delete set null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null check (amount > 0),
  source text not null,
  reference_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, source, reference_id)
);

insert into public.badges (id, name, description) values
  ('water_saver', 'Water Saver', 'Turned off the tap and saved water.'),
  ('nature_protector', 'Nature Protector', 'Planted seeds or cared for local greenery.'),
  ('waste_warrior', 'Waste Warrior', 'Sorted recyclables and reduced waste.'),
  ('climate_explorer', 'Climate Explorer', 'Saved energy and explored climate action.'),
  ('health_champion', 'Health Champion', 'Practiced healthy habits.')
on conflict (id) do nothing;

insert into public.missions (id, title, description, sdg_number, xp_reward, badge_name, badge_id, badge_icon, is_published)
values
  ('m_water_1', 'Become a Water Saver', 'Turn off the water tap while brushing your teeth for 3 full days.', 6, 50, 'Water Saver', 'water_saver', '💧', true),
  ('m_land_1', 'Plant a Green Sprout', 'Plant a seed in a small pot, cup, or garden and give it water and sunlight.', 15, 60, 'Nature Protector', 'nature_protector', '🌳', true),
  ('m_consumption_1', 'Recycling Detective', 'Inspect your home waste and sort 5 items into paper, plastic, or compost.', 12, 50, 'Waste Warrior', 'waste_warrior', '♻️', true),
  ('m_climate_1', 'Energy Lights-Out Patrol', 'Switch off lights in empty rooms before bedtime.', 13, 40, 'Climate Explorer', 'climate_explorer', '🌎', true),
  ('m_health_1', 'Rainbow Plate Challenge', 'Eat 3 different colorful fruits or vegetables in one day.', 3, 50, 'Health Champion', 'health_champion', '❤️', true)
on conflict (id) do nothing;

insert into public.quiz_questions (id, quiz_id, question, choices, answer_key) values
  ('q6_1', 'quiz_sdg_6', 'What should you do while brushing your teeth?', '["Leave the tap running continuously", "Turn the tap off until you rinse", "Splash water on the bathroom mirror", "Turn the water on full blast"]', '1'),
  ('q6_2', 'quiz_sdg_6', 'How much of Earth water is freshwater ready to drink?', '["Almost all of it", "About half of it", "Less than 1 percent", "None at all"]', '2'),
  ('q6_3', 'quiz_sdg_6', 'What is a great eco-friendly way to water house plants?', '["Collect clean rainwater in a bucket", "Use hot soapy sink water", "Water them with sugary juice", "Spray them with a fire hose"]', '0'),
  ('q15_1', 'quiz_sdg_15', 'What do green leaves give humans and animals to breathe?', '["Fresh oxygen", "Smoke and dust", "Sparkly glitter", "Soda bubbles"]', '0'),
  ('q15_2', 'quiz_sdg_15', 'Why are bees and butterflies important for nature?', '["They play loud music", "They pollinate flowers so fruits and seeds grow", "They paint flowers", "They eat tree bark"]', '1'),
  ('q15_3', 'quiz_sdg_15', 'What should you do with snack wrappers while hiking?', '["Bury them", "Throw them into a stream", "Pack them out and use a bin", "Leave them for birds"]', '2'),
  ('q12_1', 'quiz_sdg_12', 'What are the 3 Rs of protecting our environment?', '["Run, Rest, Repeat", "Reduce, Reuse, Recycle", "Read, Rhyme, Remember", "Rumble, Roar, Rock"]', '1'),
  ('q12_2', 'quiz_sdg_12', 'What is a fun way to reuse a cardboard cereal box?', '["Throw it on the lawn", "Turn it into a toy or art storage", "Tear it up and litter", "Use it as a dinner plate"]', '1'),
  ('q12_3', 'quiz_sdg_12', 'Why carry a reusable water bottle?', '["It keeps plastic trash out of nature", "Plastic disappears forever", "It is heavier", "It is disposable"]', '0'),
  ('q13_1', 'quiz_sdg_13', 'What is a great habit before leaving a room?', '["Turn on every lamp", "Turn off lights and fan", "Max out the air conditioner", "Leave the television playing"]', '1'),
  ('q13_2', 'quiz_sdg_13', 'Which way of traveling does not pollute with exhaust smoke?', '["Ride a bicycle or scooter", "Drive a diesel truck", "Drive a gas car", "Take a jet airplane"]', '0'),
  ('q13_3', 'quiz_sdg_13', 'What natural power comes from the sky without smoke?', '["Coal smoke", "Sunshine and wind", "Burning leaves", "Gasoline vapor"]', '1'),
  ('q3_1', 'quiz_sdg_3', 'What does eating a rainbow mean?', '["Eat colorful fruits and vegetables", "Eat only rainbow candy", "Paint food", "Eat while looking at a rainbow"]', '0'),
  ('q3_2', 'quiz_sdg_3', 'How long should you wash your hands with soap?', '["One second", "20 seconds", "Two hours", "Do not wash"]', '1'),
  ('q3_3', 'quiz_sdg_3', 'Why is getting 9 to 10 hours of sleep good for kids?', '["It helps the brain and body recover", "It makes pajamas cooler", "It lets clocks nap", "It stops hunger forever"]', '0')
on conflict (id) do nothing;

create or replace function public.create_profile_for_auth_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name, full_name, email, role, email_verified)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'Explorer'),
    coalesce(new.raw_user_meta_data ->> 'name', 'Explorer'),
    new.email,
    'student',
    new.email_confirmed_at is not null
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.create_profile_for_auth_user();

create or replace function public.record_email_verification()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles
  set email = new.email, email_verified = new.email_confirmed_at is not null, updated_at = now()
  where id = new.id;
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    insert into public.audit_logs (actor_id, action) values (new.id, 'email_verified');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_email_verified
after update of email_confirmed_at on auth.users
for each row execute procedure public.record_email_verification();

create or replace function public.set_profile_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_profile_updated_at();

create or replace function public.consume_teacher_invite(invite_code_hash text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  consumed_count integer;
begin
  update public.teacher_invites
  set consumed_at = now()
  where code_hash = invite_code_hash and consumed_at is null;
  get diagnostics consumed_count = row_count;
  return consumed_count = 1;
end;
$$;

create or replace function public.review_submission(
  target_submission_id uuid,
  reviewer_id uuid,
  new_status public.submission_status,
  new_comment text
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  sub public.submissions;
  mission public.missions;
  new_xp integer;
  new_level integer;
begin
  if new_status not in ('approved', 'rejected', 'needs_resubmission') then
    raise exception 'invalid review status';
  end if;
  select * into sub from public.submissions where id = target_submission_id for update;
  if sub.id is null or sub.status in ('approved', 'rejected') then
    raise exception 'submission is not reviewable';
  end if;
  perform 1 from public.profiles where id = sub.student_id for update;
  if not exists (
    select 1 from public.classes c
    join public.class_students cs on cs.class_id = c.id
    where c.teacher_id = reviewer_id and cs.student_id = sub.student_id
  ) then
    raise exception 'reviewer is not associated with the student';
  end if;
  if not exists (
    select 1 from public.profiles p where p.id = sub.student_id and p.email_verified
  ) then
    raise exception 'student email is not verified';
  end if;
  if new_status = 'approved' and exists (
    select 1 from public.submissions other
    where other.student_id = sub.student_id and other.mission_id = sub.mission_id
      and other.id <> sub.id and other.status = 'approved'
  ) then
    raise exception 'mission reward already issued';
  end if;
  update public.submissions
  set status = new_status, reviewed_by = reviewer_id, review_comment = left(new_comment, 1000)
  where id = sub.id;
  if new_status = 'approved' then
    select * into mission from public.missions where id = sub.mission_id;
    new_xp := (select xp from public.profiles where id = sub.student_id) + mission.xp_reward;
    new_level := case when new_xp >= 1000 then 5 when new_xp >= 600 then 4 when new_xp >= 300 then 3 when new_xp >= 100 then 2 else 1 end;
    update public.profiles set
      xp = new_xp,
      level = new_level,
      streak = case when last_activity_at::date = current_date then streak when last_activity_at::date = current_date - 1 then streak + 1 else 1 end,
      last_activity_at = now()
    where id = sub.student_id;
    update public.submissions set xp_awarded = mission.xp_reward where id = sub.id;
    insert into public.xp_transactions (user_id, amount, source, reference_id)
    values (sub.student_id, mission.xp_reward, 'mission_approval', sub.id::text);
    if mission.badge_id is not null then
      insert into public.user_badges (user_id, badge_id) values (sub.student_id, mission.badge_id)
      on conflict (user_id, badge_id) do nothing;
      if found then
        insert into public.audit_logs (actor_id, action, details)
        values (reviewer_id, 'badge_unlocked', jsonb_build_object('student_id', sub.student_id, 'badge_id', mission.badge_id));
      end if;
    end if;
    insert into public.sdg_progress (user_id, sdg_number, progress)
    values (sub.student_id, mission.sdg_number, 10)
    on conflict (user_id, sdg_number) do update
    set progress = least(100, public.sdg_progress.progress + 10), updated_at = now();
    insert into public.virtual_planet_progress (user_id, progress)
    values (sub.student_id, least(100, mission.xp_reward / 10))
    on conflict (user_id) do update
    set progress = least(100, public.virtual_planet_progress.progress + mission.xp_reward / 10), updated_at = now();
    insert into public.book_pages (user_id, submission_id, mission_id, sdg_number, title, caption, frame_id, stickers, xp_earned, badge_name, badge_icon)
    values (
      sub.student_id, sub.id, mission.id, mission.sdg_number, mission.title, sub.caption,
      coalesce(sub.presentation ->> 'frame', 'water'),
      coalesce(sub.presentation -> 'stickers', '[]'::jsonb),
      mission.xp_reward, mission.badge_name, mission.badge_icon
    )
    on conflict (submission_id) do nothing;
    insert into public.audit_logs (actor_id, action, details)
    values (reviewer_id, 'xp_rewarded', jsonb_build_object('submission_id', sub.id, 'xp', mission.xp_reward));
    return jsonb_build_object('status', new_status, 'xp_awarded', mission.xp_reward, 'total_xp', new_xp, 'level', new_level);
  end if;
  insert into public.audit_logs (actor_id, action, details)
  values (reviewer_id, 'submission_reviewed', jsonb_build_object('submission_id', sub.id, 'status', new_status));
  return jsonb_build_object('status', new_status, 'xp_awarded', 0);
end;
$$;

create or replace function public.submit_quiz_attempt(
  target_quiz_id text,
  attempt_user_id uuid,
  submitted_answers jsonb
)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  question_count integer;
  correct_count integer;
  reward integer := 0;
  total_xp integer;
  new_level integer;
  attempt_id uuid;
  reward_claimed text;
begin
  if jsonb_typeof(submitted_answers) <> 'object' or jsonb_object_length(submitted_answers) > 100 then
    raise exception 'invalid answers';
  end if;
  select count(*), count(*) filter (where submitted_answers ->> id = answer_key)
  into question_count, correct_count
  from public.quiz_questions where quiz_id = target_quiz_id;
  if question_count = 0 then raise exception 'quiz not found'; end if;
  if exists (select 1 from public.profiles where id = attempt_user_id and role = 'student') is not true then
    raise exception 'student profile required';
  end if;
  insert into public.user_quiz_rewards (user_id, quiz_id)
  values (attempt_user_id, target_quiz_id)
  on conflict do nothing
  returning quiz_id into reward_claimed;
  if reward_claimed is not null then
    reward := 20 + case when correct_count = question_count then 10 else 0 end;
  end if;
  insert into public.quiz_attempts (user_id, quiz_id, score, total, xp_awarded, answers)
  values (attempt_user_id, target_quiz_id, correct_count, question_count, reward, submitted_answers)
  returning id into attempt_id;
  if reward > 0 then
    update public.profiles set
      xp = xp + reward,
      streak = case when last_activity_at::date = current_date then streak when last_activity_at::date = current_date - 1 then streak + 1 else 1 end,
      last_activity_at = now()
    where id = attempt_user_id returning xp into total_xp;
    new_level := case when total_xp >= 1000 then 5 when total_xp >= 600 then 4 when total_xp >= 300 then 3 when total_xp >= 100 then 2 else 1 end;
    update public.profiles set level = new_level where id = attempt_user_id;
    insert into public.xp_transactions (user_id, amount, source, reference_id)
    values (attempt_user_id, reward, 'quiz_first_attempt', attempt_id::text);
    insert into public.audit_logs (actor_id, action, details)
    values (attempt_user_id, 'quiz_xp_rewarded', jsonb_build_object('quiz_id', target_quiz_id, 'xp', reward));
  else
    select xp, level into total_xp, new_level from public.profiles where id = attempt_user_id;
  end if;
  return jsonb_build_object(
    'id', attempt_id,
    'quiz_id', target_quiz_id,
    'score', correct_count,
    'total', question_count,
    'xp_awarded', reward,
    'total_xp', total_xp,
    'level', new_level
  );
end;
$$;

create or replace function public.complete_summer_day(attempt_user_id uuid, summer_day smallint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  awarded boolean;
  total_xp integer;
  new_level integer;
  completed_days smallint[];
begin
  if summer_day < 1 or summer_day > 30 or not exists (
    select 1 from public.profiles where id = attempt_user_id and role = 'student'
  ) then
    raise exception 'invalid summer day';
  end if;
  insert into public.summer_completions (user_id, day) values (attempt_user_id, summer_day)
  on conflict do nothing returning true into awarded;
  if awarded then
    insert into public.audit_logs (actor_id, action, details)
    values (attempt_user_id, 'summer_day_completed', jsonb_build_object('day', summer_day));
  end if;
  select xp, level into total_xp, new_level from public.profiles where id = attempt_user_id;
  select coalesce(array_agg(day order by day), array[]::smallint[]) into completed_days
  from public.summer_completions where user_id = attempt_user_id;
  return jsonb_build_object('completedDays', completed_days, 'totalDays', 30, 'currentDay', least(30, coalesce((select max(day) + 1 from public.summer_completions where user_id = attempt_user_id), 1)), 'xpAwarded', 0, 'totalXp', total_xp, 'level', new_level);
end;
$$;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_students enable row level security;
alter table public.parent_child_links enable row level security;
alter table public.missions enable row level security;
alter table public.submissions enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.user_quiz_rewards enable row level security;
alter table public.sdg_progress enable row level security;
alter table public.book_pages enable row level security;
alter table public.virtual_planet_progress enable row level security;
alter table public.summer_completions enable row level security;
alter table public.family_missions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.teacher_invites enable row level security;
alter table public.xp_transactions enable row level security;

create policy "users view own profile" on public.profiles for select using (id = auth.uid());
create policy "users view own XP ledger" on public.xp_transactions for select using (user_id = auth.uid());
create policy "students update own avatar" on public.profiles for update using (id = auth.uid() and role = 'student') with check (id = auth.uid() and role = 'student');
create policy "class owners access classes" on public.classes for all using (teacher_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher' and p.email_verified)) with check (teacher_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher' and p.email_verified));
create policy "students view own memberships" on public.class_students for select using (student_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'student' and p.email_verified));
create policy "teachers view their memberships" on public.class_students for select using (exists (select 1 from public.classes c join public.profiles p on p.id = c.teacher_id where c.id = class_id and c.teacher_id = auth.uid() and p.role = 'teacher' and p.email_verified));
create policy "parents view own links" on public.parent_child_links for select using (parent_id = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'parent' and p.email_verified));
create policy "published missions readable by assigned users" on public.missions for select using (
  is_published and (
    class_id is null
    or exists (
      select 1 from public.class_students cs join public.profiles p on p.id = cs.student_id
      where cs.class_id = missions.class_id and cs.student_id = auth.uid() and p.role = 'student' and p.email_verified
    )
    or exists (
      select 1 from public.classes c join public.profiles p on p.id = c.teacher_id
      where c.id = missions.class_id and c.teacher_id = auth.uid() and p.role = 'teacher' and p.email_verified
    )
    or exists (
      select 1 from public.parent_child_links l
      join public.class_students cs on cs.student_id = l.student_id
      join public.profiles parent_profile on parent_profile.id = l.parent_id
      join public.profiles child_profile on child_profile.id = l.student_id
      where l.parent_id = auth.uid() and cs.class_id = missions.class_id
        and parent_profile.role = 'parent' and parent_profile.email_verified
        and child_profile.role = 'student' and child_profile.email_verified
    )
  )
);
create policy "authenticated users view badge catalog" on public.badges for select using (auth.uid() is not null);
create policy "mission creators manage own missions" on public.missions for all using (created_by = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher' and p.email_verified)) with check (created_by = auth.uid() and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher' and p.email_verified));
create policy "students view own submissions" on public.submissions for select using (student_id = auth.uid());
create policy "teachers view class submissions" on public.submissions for select using (exists (select 1 from public.class_students cs join public.classes c on c.id = cs.class_id where cs.student_id = submissions.student_id and c.teacher_id = auth.uid()));
create policy "students view own badges" on public.user_badges for select using (user_id = auth.uid());
create policy "users view own quiz attempts" on public.quiz_attempts for select using (user_id = auth.uid());
create policy "users view own quiz reward state" on public.user_quiz_rewards for select using (user_id = auth.uid());
create policy "users view own sdg progress" on public.sdg_progress for select using (user_id = auth.uid());
create policy "users view own book pages" on public.book_pages for select using (user_id = auth.uid());
create policy "users view own planet progress" on public.virtual_planet_progress for select using (user_id = auth.uid());
create policy "students view own summer progress" on public.summer_completions for select using (user_id = auth.uid());
create policy "parents view linked family missions" on public.family_missions for select using (parent_id = auth.uid() and exists (select 1 from public.parent_child_links l where l.parent_id = auth.uid() and l.student_id = family_missions.student_id));

grant select on public.profiles, public.classes, public.class_students, public.parent_child_links,
  public.missions, public.submissions, public.badges, public.user_badges, public.quiz_attempts,
  public.user_quiz_rewards, public.sdg_progress, public.book_pages, public.virtual_planet_progress,
  public.xp_transactions to authenticated;
grant update (avatar) on public.profiles to authenticated;
revoke update (name, full_name, email, role, email_verified, xp, level, streak, child_invite_code) on public.profiles from authenticated;
revoke all on public.audit_logs, public.quiz_questions from anon, authenticated;
revoke all on public.teacher_invites from anon, authenticated;
revoke execute on function public.consume_teacher_invite(text) from public, anon, authenticated;
grant execute on function public.consume_teacher_invite(text) to service_role;
revoke execute on function public.review_submission(uuid, uuid, public.submission_status, text) from public, anon, authenticated;
grant execute on function public.review_submission(uuid, uuid, public.submission_status, text) to service_role;
revoke execute on function public.submit_quiz_attempt(text, uuid, jsonb) from public, anon, authenticated;
grant execute on function public.submit_quiz_attempt(text, uuid, jsonb) to service_role;
revoke execute on function public.complete_summer_day(uuid, smallint) from public, anon, authenticated;
grant execute on function public.complete_summer_day(uuid, smallint) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('mission-evidence', 'mission-evidence', false, 6291456, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = 6291456,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;