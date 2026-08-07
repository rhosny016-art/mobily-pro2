import { useEffect, useState } from "react";
import { Filter, Inbox, Loader2, Mail, Phone, Search, Trash2, X } from "lucide-react";
import { deleteRequest, getRequests, updateRequestStatus, addRequest, type ContactRequest } from "@/lib/store";

const STATUS_LABELS: Record<ContactRequest["status"], string> = {
  new: "جديد",
  contacted: "تم التواصل",
  closed: "مغلق",
};

const STATUS_COLORS: Record<ContactRequest["status"], string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-orange-100 text-orange-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function DashboardRequests() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | ContactRequest["status"]>("all");

  // Add Manual Request states with full validation
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});
  const [addError, setAddError] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = () => getRequests().then(setRequests);

  useEffect(() => {
    getRequests().then((list) => {
      setRequests(list);
      setLoading(false);
    });
  }, []);

  const handleAddChange = (k: string, val: string) => {
    setAddForm((prev) => ({ ...prev, [k]: val }));
    if (addErrors[k]) {
      setAddErrors((prev) => {
        const copy = { ...prev };
        delete copy[k];
        return copy;
      });
    }
  };

  const validateAddForm = () => {
    const errs: Record<string, string> = {};
    if (addForm.name.trim().length < 3) {
      errs.name = "يجب أن يكون الاسم 3 أحرف على الأقل";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addForm.email.trim())) {
      errs.email = "يرجى إدخال بريد إلكتروني صحيح (مثال: name@example.com)";
    }
    if (addForm.phone.trim()) {
      const phoneRegex = /^[\d+-\s()]{8,15}$/;
      if (!phoneRegex.test(addForm.phone.trim())) {
        errs.phone = "يرجى إدخال رقم هاتف صحيح (8 إلى 15 رقماً)";
      }
    }
    if (addForm.message.trim().length < 10) {
      errs.message = "يجب أن تحتوي الرسالة على 10 أحرف على الأقل";
    }
    setAddErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddForm()) {
      setAddError("يرجى تصحيح الأخطاء أولاً.");
      return;
    }
    setSaving(true);
    setAddError("");
    try {
      await addRequest(addForm);
      setOpenAddModal(false);
      refresh();
    } catch (err) {
      setAddError("فشل حفظ الطلب، برجاء المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  const filtered = requests.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.subject || "").toLowerCase().includes(q) ||
      r.message.toLowerCase().includes(q);
    const matchesStatus = status === "all" || r.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold">طلبات العملاء</h1>
        <button
          onClick={() => {
            setOpenAddModal(true);
            setAddForm({ name: "", email: "", phone: "", subject: "", message: "" });
            setAddErrors({});
            setAddError("");
          }}
          className="gradient-primary text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-95 transition"
        >
          + إضافة طلب يدوي
        </button>
      </div>

      {/* الفلاتر */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو البريد أو الرسالة..."
            className="w-full bg-white rounded-xl border border-border pr-10 pl-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="bg-white rounded-xl border border-border pr-10 pl-8 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
          >
            <option value="all">كل الحالات</option>
            <option value="new">جديد</option>
            <option value="contacted">تم التواصل</option>
            <option value="closed">مغلق</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        عرض {filtered.length} من {requests.length} طلب
      </p>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-14 text-center">
          <Inbox className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" aria-hidden="true" />
          <p className="font-bold text-muted-foreground">لا توجد طلبات مطابقة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => {
            const serviceMatch = r.subject?.match(/طلب خدمة:\s*(.+)/);
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-border p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <span className="w-12 h-12 rounded-full gradient-primary text-white flex items-center justify-center font-black text-lg shrink-0">
                      {r.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-extrabold">{r.name}</p>
                      <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                          <span dir="ltr">{r.email}</span>
                        </span>
                        {r.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                            <span dir="ltr">{r.phone}</span>
                          </span>
                        )}
                        <span>{new Date(r.created_date).toLocaleString("ar-EG")}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_COLORS[r.status]}`}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </div>

                {serviceMatch && (
                  <div className="mt-4 bg-primary/5 border border-primary/15 rounded-xl px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground">الخدمة المطلوبة: </span>
                    <span className="font-bold text-primary">{serviceMatch[1]}</span>
                  </div>
                )}

                <p className="mt-4 bg-muted rounded-xl p-4 text-sm leading-relaxed">{r.message}</p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <select
                    value={r.status}
                    onChange={async (e) => { await updateRequestStatus(r.id, e.target.value as ContactRequest["status"]); refresh(); }}
                    className="bg-white rounded-lg border border-border px-3 py-2 text-xs font-bold outline-none"
                  >
                    <option value="new">جديد</option>
                    <option value="contacted">تم التواصل</option>
                    <option value="closed">مغلق</option>
                  </select>
                  <a
                    href={`mailto:${r.email}?subject=${encodeURIComponent("رد على طلبك - دلّني")}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg hover:bg-primary/20 transition"
                  >
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    رد بالبريد
                  </a>
                  <button
                    onClick={async () => { if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) { await deleteRequest(r.id); refresh(); } }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-destructive bg-destructive/10 px-3 py-2 rounded-lg hover:bg-destructive/20 transition mr-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    حذف
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* نافذة إضافة طلب جديد */}
      {openAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenAddModal(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold">إضافة طلب يدوي جديد</h2>
              <button onClick={() => setOpenAddModal(false)} aria-label="إغلاق">
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1.5">الاسم الكامل *</label>
                <input
                  required
                  value={addForm.name}
                  onChange={(e) => handleAddChange("name", e.target.value)}
                  placeholder="اسم العميل"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 ${
                    addErrors.name ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {addErrors.name && <p className="text-xs text-destructive mt-1 font-semibold">{addErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني *</label>
                <input
                  required
                  type="email"
                  value={addForm.email}
                  onChange={(e) => handleAddChange("email", e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 ${
                    addErrors.email ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {addErrors.email && <p className="text-xs text-destructive mt-1 font-semibold">{addErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">رقم الهاتف</label>
                <input
                  value={addForm.phone}
                  onChange={(e) => handleAddChange("phone", e.target.value)}
                  placeholder="01xxxxxxxxx"
                  dir="ltr"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 ${
                    addErrors.phone ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {addErrors.phone && <p className="text-xs text-destructive mt-1 font-semibold">{addErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">الموضوع</label>
                <input
                  value={addForm.subject}
                  onChange={(e) => handleAddChange("subject", e.target.value)}
                  placeholder="موضوع الطلب"
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">الرسالة / تفاصيل الطلب *</label>
                <textarea
                  required
                  rows={4}
                  value={addForm.message}
                  onChange={(e) => handleAddChange("message", e.target.value)}
                  placeholder="اكتب تفاصيل طلب العميل هنا..."
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 ${
                    addErrors.message ? "border-destructive focus:ring-destructive/50" : "border-border"
                  }`}
                />
                {addErrors.message && <p className="text-xs text-destructive mt-1 font-semibold">{addErrors.message}</p>}
              </div>

              {addError && (
                <div className="bg-destructive/10 text-destructive text-xs font-semibold rounded-xl p-3">
                  {addError}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full gradient-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                حفظ الطلب
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
