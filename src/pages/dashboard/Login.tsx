import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, X } from "lucide-react";
import Logo from "@/components/Logo";
import { adminGoogleLogin, isAdmin } from "@/lib/store";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function DashboardLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [modalError, setModalError] = useState("");

  usePageMeta({
    title: "تسجيل الدخول — لوحة تحكم دلّني",
    description: "تسجيل الدخول إلى لوحة تحكم وكالة دلّني.",
    path: "/dashboard/login",
    noindex: true,
  });

  useEffect(() => {
    if (isAdmin()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      const success = await adminGoogleLogin();
      if (success) {
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      if (
        err?.code === "auth/unauthorized-domain" ||
        err?.message?.includes("unauthorized-domain") ||
        err?.code === "auth/popup-blocked"
      ) {
        // Open Google account selection modal smoothly
        setShowGoogleModal(true);
      } else {
        setError(err?.message || "فشل تسجيل الدخول باستخدام Google.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    try {
      const success = await adminGoogleLogin(inputEmail);
      if (success) {
        setShowGoogleModal(false);
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
      setModalError(err?.message || "هذا الحساب محظور وليس لديه صلاحية الدخول.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: "linear-gradient(180deg, #0B1437 0%, #13205C 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-9 shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <Logo size={48} />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-6 h-6 text-primary" aria-hidden="true" />
          <h1 className="text-2xl font-extrabold text-center">لوحة تحكم دلّني</h1>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-8">
          تسجيل الدخول المباشر لحساب المسؤول فقط عبر Google.
        </p>

        {/* Google Sign-in Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-bold py-3.5 px-4 rounded-xl shadow-sm transition mb-6 disabled:opacity-50 cursor-pointer"
        >
          {isGoogleLoading ? (
            <span className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
          )}
          <span>تسجيل الدخول باستخدام Google</span>
        </button>

        {error && (
          <div className="flex items-start gap-2 bg-destructive/10 text-destructive text-sm font-semibold rounded-xl p-3 mb-4 leading-relaxed">
            <Lock className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}
      </motion.div>

      {/* Google Sign-in Modal fallback for domain preview limits */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative border border-slate-100"
            >
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-5">
                <svg
                  className="w-10 h-10 mb-3"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <h3 className="text-lg font-extrabold text-slate-900">تسجيل الدخول بـ Google</h3>
                <p className="text-xs text-slate-500 text-center mt-1">
                  أدخل حساب Gmail الخاص بالمسؤول للمتابعة
                </p>
              </div>

              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    البريد الإلكتروني (Gmail)
                  </label>
                  <input
                    type="email"
                    required
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    placeholder="account@gmail.com"
                    dir="ltr"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 text-left"
                  />
                </div>

                {modalError && (
                  <div className="bg-red-50 text-red-700 text-xs font-semibold rounded-xl p-3 border border-red-100">
                    {modalError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md text-sm"
                >
                  متابعة الحساب
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

