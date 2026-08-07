import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { getSiteSettings, saveSiteSettings } from "@/lib/store";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/siteData";

const inputCls =
  "w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
      <h2 className="font-extrabold text-lg">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, dir, textarea }: { label: string; value: string; onChange: (v: string) => void; dir?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1.5">{label}</label>
      {textarea ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} dir={dir} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} dir={dir} />
      )}
    </div>
  );
}

export default function DashboardSettings() {
  const [s, setS] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSiteSettings().then((data) => {
      setS(data);
      setLoading(false);
    });
  }, []);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => setS((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    await saveSiteSettings(s);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-extrabold">إعدادات الموقع</h1>

      <Card title="المعلومات العامة">
        <Field label="اسم الموقع" value={s.site_name} onChange={(v) => set("site_name", v)} />
        <Field label="الوصف المختصر" value={s.tagline} onChange={(v) => set("tagline", v)} />
      </Card>

      <Card title="قسم الهيرو">
        <Field label="شارة الهيرو" value={s.hero_badge} onChange={(v) => set("hero_badge", v)} />
        <Field label="النص الفرعي" value={s.hero_subtitle} onChange={(v) => set("hero_subtitle", v)} textarea />
      </Card>

      <Card title="الإحصائيات">
        {s.stats.map((st, i) => (
          <div key={i} className="flex gap-3">
            <input
              value={st.value}
              onChange={(e) => set("stats", s.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
              className={`${inputCls} w-32`}
              placeholder="القيمة"
            />
            <input
              value={st.label}
              onChange={(e) => set("stats", s.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
              className={inputCls}
              placeholder="التسمية"
            />
            <button
              onClick={() => set("stats", s.stats.filter((_, j) => j !== i))}
              className="p-2.5 rounded-xl text-destructive hover:bg-destructive/10 shrink-0"
              aria-label="حذف"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ))}
        <button
          onClick={() => set("stats", [...s.stats, { value: "", label: "" }])}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          إضافة إحصائية
        </button>
      </Card>

      <Card title="بيانات التواصل">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="رقم واتساب" value={s.whatsapp_number} onChange={(v) => set("whatsapp_number", v)} dir="ltr" />
          <Field label="الهاتف" value={s.phone} onChange={(v) => set("phone", v)} dir="ltr" />
          <Field label="البريد الإلكتروني" value={s.email} onChange={(v) => set("email", v)} dir="ltr" />
          <Field label="العنوان" value={s.address} onChange={(v) => set("address", v)} />
          <Field label="ساعات العمل" value={s.working_hours} onChange={(v) => set("working_hours", v)} />
          <Field label="فيسبوك" value={s.social_facebook} onChange={(v) => set("social_facebook", v)} dir="ltr" />
          <Field label="إنستجرام" value={s.social_instagram} onChange={(v) => set("social_instagram", v)} dir="ltr" />
          <Field label="لينكدإن" value={s.social_linkedin} onChange={(v) => set("social_linkedin", v)} dir="ltr" />
        </div>
      </Card>

      <Card title="صفحة من نحن">
        <Field label="العنوان" value={s.about_title} onChange={(v) => set("about_title", v)} />
        <Field label="الوصف" value={s.about_subtitle} onChange={(v) => set("about_subtitle", v)} />
        <Field label="القصة (كل سطر = فقرة)" value={s.about_story} onChange={(v) => set("about_story", v)} textarea />
      </Card>

      <Card title="الفوتر">
        <Field label="نص الفوتر" value={s.footer_text} onChange={(v) => set("footer_text", v)} textarea />
      </Card>

      {/* شريط الحفظ */}
      <div className="fixed bottom-0 left-0 right-0 lg:right-64 bg-white/90 backdrop-blur border-t border-border p-4 flex items-center justify-between gap-4 z-40">
        {saved ? <span className="text-secondary font-bold text-sm">تم الحفظ بنجاح ✓</span> : <span />}
        <button
          onClick={save}
          disabled={saving}
          className="gradient-primary text-white font-bold px-8 py-3 rounded-xl inline-flex items-center gap-2 hover:opacity-90 transition disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Save className="w-4 h-4" aria-hidden="true" />}
          {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>
    </div>
  );
}
