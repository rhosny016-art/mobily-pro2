import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, ExternalLink, Inbox, LogOut, Menu, Package, Settings, X } from "lucide-react";
import Logo from "@/components/Logo";
import { adminLogout, isAdmin } from "@/lib/store";
import { usePageMeta } from "@/hooks/usePageMeta";

const NAV = [
  { to: "/dashboard", end: true, icon: BarChart3, label: "الإحصائيات" },
  { to: "/dashboard/services", end: false, icon: Package, label: "الخدمات" },
  { to: "/dashboard/requests", end: false, icon: Inbox, label: "الطلبات" },
  { to: "/dashboard/settings", end: false, icon: Settings, label: "الإعدادات" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  usePageMeta({
    title: "لوحة تحكم دلّني",
    description: "لوحة تحكم وكالة دلّني.",
    path: "/dashboard",
    noindex: true,
  });

  useEffect(() => {
    if (!isAdmin()) navigate("/dashboard/login", { replace: true });
  }, [navigate]);

  const logout = () => {
    adminLogout();
    navigate("/dashboard/login", { replace: true });
  };

  const navLinks = (
    <>
      <nav className="flex-1 space-y-1.5 px-4">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                isActive ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-foreground/70 hover:bg-muted"
              }`
            }
          >
            <item.icon className="w-5 h-5" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 pb-6 space-y-1.5 border-t border-border pt-4">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-foreground/70 hover:bg-muted transition">
          <ExternalLink className="w-5 h-5" aria-hidden="true" />
          عرض الموقع
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-foreground/70 hover:bg-destructive/10 hover:text-destructive transition"
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
          تسجيل الخروج
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted">
      {/* Sidebar ديسكتوب */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 right-0 w-64 bg-white border-l border-border">
        <div className="p-6">
          <Logo animated={false} />
        </div>
        {navLinks}
      </aside>

      {/* Sidebar موبايل */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-72 bg-white flex flex-col">
            <div className="flex items-center justify-between p-5">
              <Logo animated={false} />
              <button onClick={() => setOpen(false)} aria-label="إغلاق">
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            {navLinks}
          </aside>
        </div>
      )}

      {/* Topbar موبايل */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-border flex items-center justify-between px-4 py-3">
        <button onClick={() => setOpen(true)} aria-label="فتح القائمة">
          <Menu className="w-6 h-6" aria-hidden="true" />
        </button>
        <Logo animated={false} size={32} />
        <span className="w-6" />
      </header>

      <main className="lg:mr-64 p-4 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
