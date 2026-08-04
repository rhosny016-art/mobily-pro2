import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Star, X } from "lucide-react";
import { getServices, swapServiceOrder, updateService } from "@/lib/store";
import type { Service } from "@/lib/siteData";

const inputCls =
  "w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50";

export default function DashboardServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: "", short: "", description: "" });

  const refresh = () => getServices().then(setServices);

  useEffect(() => {
    getServices().then((list) => {
      setServices(list);
      setLoading(false);
    });
  }, []);

  const move = async (index: number, dir: -1 | 1) => {
    const other = services[index + dir];
    if (!other) return;
    await swapServiceOrder(services[index].id, other.id);
    refresh();
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ title: s.title, short: s.short, description: s.description });
  };

  const saveEdit = async () => {
    if (!editing) return;
    await updateService(editing.id, form);
    setEditing(null);
    refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">إدارة الخدمات</h1>
        <span className="text-sm text-muted-foreground">{services.length} خدمة</span>
      </div>

      <div className="space-y-3">
        {services.map((s, i) => (
          <div key={s.id} className={`bg-white rounded-2xl border border-border p-5 flex items-center gap-4 ${s.visible === false ? "opacity-60" : ""}`}>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold flex items-center gap-2">
                {s.title}
                {s.featured && <Star className="w-4 h-4 text-accent" fill="#F97316" aria-hidden="true" />}
                {s.visible === false && <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">مخفية</span>}
              </p>
              <p className="text-sm text-muted-foreground truncate mt-1">{s.short}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="p-2 rounded-lg hover:bg-muted disabled:opacity-30" aria-label="تحريك لأعلى">
                <ArrowUp className="w-4 h-4" aria-hidden="true" />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === services.length - 1} className="p-2 rounded-lg hover:bg-muted disabled:opacity-30" aria-label="تحريك لأسفل">
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={async () => { await updateService(s.id, { featured: !s.featured }); refresh(); }}
                className={`p-2 rounded-lg hover:bg-muted ${s.featured ? "text-accent" : "text-muted-foreground"}`}
                aria-label="تمييز الخدمة"
              >
                <Star className="w-4 h-4" fill={s.featured ? "#F97316" : "none"} aria-hidden="true" />
              </button>
              <button
                onClick={async () => { await updateService(s.id, { visible: s.visible === false }); refresh(); }}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                aria-label={s.visible === false ? "إظهار الخدمة" : "إخفاء الخدمة"}
              >
                {s.visible === false ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
              </button>
              <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-primary/10 text-primary" aria-label="تعديل">
                <Pencil className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة التعديل */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-3xl w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold">تعديل الخدمة</h2>
              <button onClick={() => setEditing(null)} aria-label="إغلاق">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1.5">اسم الخدمة</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">الوصف المختصر</label>
                <textarea rows={2} value={form.short} onChange={(e) => setForm({ ...form, short: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5">الوصف الكامل</label>
                <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
              </div>
              <button onClick={saveEdit} className="w-full gradient-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition">
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
