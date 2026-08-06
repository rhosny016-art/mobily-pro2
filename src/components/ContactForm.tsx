import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { addRequest } from "@/lib/store";

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/50 focus:border-primary";

export default function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: defaultSubject, message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Honeypot field — hidden from real users, bots fill it in.
  const [company, setCompany] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[k];
        return copy;
      });
    }
  };

  const [error, setError] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.name.trim().length < 3) {
      newErrors.name = "يجب أن يكون الاسم 3 أحرف على الأقل";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح (مثال: you@example.com)";
    }
    if (form.phone.trim()) {
      const phoneRegex = /^[\d+-\s()]{8,15}$/;
      if (!phoneRegex.test(form.phone.trim())) {
        newErrors.phone = "يرجى إدخال رقم هاتف صحيح (8 إلى 15 رقماً)";
      }
    }
    if (form.message.trim().length < 10) {
      newErrors.message = "يجب أن تحتوي الرسالة على 10 أحرف على الأقل";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Honeypot: silently accept bot submissions without storing them.
    if (company.trim()) {
      setSuccess(true);
      return;
    }
    if (!validate()) {
      setError("يرجى تصحيح الحقول المميزة بالأحمر أولاً.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await addRequest(form);
      setSuccess(true);
    } catch {
      setError("حدث خطأ أثناء إرسال طلبك، برجاء المحاولة مرة أخرى أو التواصل عبر واتساب مباشرة.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-border p-10 text-center"
      >
        <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-2xl font-extrabold mb-2">تم إرسال طلبك بنجاح!</h3>
        <p className="text-muted-foreground mb-6">سنتواصل معك في أقرب وقت ممكن.</p>
        <button
          onClick={() => {
            setSuccess(false);
            setForm({ name: "", email: "", phone: "", subject: defaultSubject, message: "" });
            setErrors({});
          }}
          className="text-primary font-bold hover:underline"
        >
          إرسال طلب آخر
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-border p-7 space-y-4 shadow-sm">
      {/* Honeypot anti-spam field — hidden from real users. */}
      <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company-hp">اسم الشركة (اتركه فارغاً)</label>
        <input
          id="company-hp"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1.5">الاسم *</label>
          <input required value={form.name} onChange={set("name")} className={`${inputCls} ${errors.name ? "border-destructive focus:ring-destructive/50" : ""}`} placeholder="اسمك الكامل" />
          {errors.name && <p className="text-xs text-destructive mt-1 font-semibold">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني *</label>
          <input required type="email" value={form.email} onChange={set("email")} className={`${inputCls} ${errors.email ? "border-destructive focus:ring-destructive/50" : ""}`} placeholder="you@example.com" dir="ltr" />
          {errors.email && <p className="text-xs text-destructive mt-1 font-semibold">{errors.email}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1.5">رقم الهاتف</label>
          <input value={form.phone} onChange={set("phone")} className={`${inputCls} ${errors.phone ? "border-destructive focus:ring-destructive/50" : ""}`} placeholder="01xxxxxxxxx" dir="ltr" />
          {errors.phone && <p className="text-xs text-destructive mt-1 font-semibold">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold mb-1.5">الموضوع</label>
          <input value={form.subject} onChange={set("subject")} className={inputCls} placeholder="موضوع الرسالة" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold mb-1.5">الرسالة *</label>
        <textarea required rows={4} value={form.message} onChange={set("message")} className={`${inputCls} ${errors.message ? "border-destructive focus:ring-destructive/50" : ""}`} placeholder="اكتب رسالتك هنا..." />
        {errors.message && <p className="text-xs text-destructive mt-1 font-semibold">{errors.message}</p>}
      </div>
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm font-semibold rounded-xl p-3">{error}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full gradient-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Send className="w-5 h-5" aria-hidden="true" />}
        {loading ? "جارٍ الإرسال..." : "إرسال الطلب"}
      </button>
    </form>
  );
}
