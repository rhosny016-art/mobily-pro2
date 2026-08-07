-- ============================================
-- شغّل الكود ده كامل في: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================

-- 1) جدول إعدادات الموقع (صف واحد ثابت)
create table if not exists site_settings (
  id text primary key,
  data jsonb not null default '{}'::jsonb
);

-- 2) جدول تعديلات الخدمات (يخزن بس الفروقات عن القيم الافتراضية)
create table if not exists service_overrides (
  id text primary key,
  data jsonb not null default '{}'::jsonb
);

-- 3) جدول طلبات التواصل (Leads)
create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new',
  created_date timestamptz not null default now()
);

-- 4) جدول الزيارات (لإحصائيات لوحة التحكم)
create table if not exists visits (
  id bigserial primary key,
  page text not null,
  visitor_id text not null,
  referrer text,
  created_date timestamptz not null default now()
);

-- ============================================
-- تفعيل الحماية على مستوى الصفوف (RLS)
-- ============================================
alter table site_settings enable row level security;
alter table service_overrides enable row level security;
alter table contact_requests enable row level security;
alter table visits enable row level security;

-- إعدادات الموقع والخدمات: قراءة عامة (تظهر في الموقع) + تعديل عام
-- (ملاحظة: التعديل هنا عام لأن لوحة التحكم بتستخدم باسورد بسيط مش مصادقة حقيقية،
--  ده مناسب لموقع تسويقي بسيط، مش لبيانات حساسة)
create policy "قراءة عامة للإعدادات" on site_settings for select using (true);
create policy "تعديل عام للإعدادات" on site_settings for all using (true) with check (true);

create policy "قراءة عامة للخدمات" on service_overrides for select using (true);
create policy "تعديل عام للخدمات" on service_overrides for all using (true) with check (true);

-- طلبات التواصل: أي زائر يقدر يرسل طلب (insert)، والقراءة/التعديل/الحذف متاحة
-- (في نسخة أكثر أمانًا لاحقًا، تقدر تقيّد select/update/delete بمصادقة حقيقية)
create policy "أي حد يقدر يرسل طلب" on contact_requests for insert with check (true);
create policy "قراءة وتعديل الطلبات" on contact_requests for select using (true);
create policy "تحديث حالة الطلبات" on contact_requests for update using (true);
create policy "حذف الطلبات" on contact_requests for delete using (true);

-- الزيارات: أي حد يقدر يسجل زيارة، وأي حد يقدر يقرأها (للإحصائيات)
create policy "تسجيل الزيارات" on visits for insert with check (true);
create policy "قراءة الزيارات" on visits for select using (true);

-- ============================================
-- صف افتراضي فارغ للإعدادات (اختياري، الموقع هيستخدم القيم الافتراضية من الكود لو مش موجود)
-- ============================================
insert into site_settings (id, data) values ('default', '{}'::jsonb)
on conflict (id) do nothing;
