import { useEffect, useState } from "react";
import { Eye, Inbox, Loader2, Package, TrendingUp } from "lucide-react";
import { getRequests, getServices, getVisits, type ContactRequest, type Visit } from "@/lib/store";

export default function DashboardStats() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [services, setServices] = useState<{ id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRequests(), getVisits(), getServices()]).then(([r, v, s]) => {
      setRequests(r);
      setVisits(v);
      setServices(s.filter((x) => x.visible !== false));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
      </div>
    );
  }

  const conversion = visits.length > 0 ? ((requests.length / visits.length) * 100).toFixed(1) : "0";

  // أكثر الخدمات طلباً من حقل subject
  const serviceCounts: Record<string, number> = {};
  requests.forEach((r) => {
    const m = r.subject?.match(/طلب خدمة:\s*(.+)/);
    if (m) serviceCounts[m[1]] = (serviceCounts[m[1]] || 0) + 1;
  });
  const topServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const cards = [
    { label: "إجمالي الطلبات", value: requests.length, Icon: Inbox, color: "bg-blue-500" },
    { label: "إجمالي الزيارات", value: visits.length, Icon: Eye, color: "bg-green-500" },
    { label: "معدل التحويل", value: `${conversion}%`, Icon: TrendingUp, color: "bg-orange-500" },
    { label: "الخدمات المتاحة", value: services.length, Icon: Package, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold">لوحة الإحصائيات</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-border p-6">
            <div className={`w-11 h-11 rounded-xl ${c.color} text-white flex items-center justify-center mb-4`}>
              <c.Icon className="w-5.5 h-5.5" aria-hidden="true" />
            </div>
            <p className="text-3xl font-black">{c.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* أكثر الخدمات طلباً */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-extrabold mb-5">أكثر الخدمات طلباً</h2>
          {topServices.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد بيانات بعد.</p>
          ) : (
            <div className="space-y-4">
              {topServices.map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm font-semibold mb-1.5">
                    <span>{name}</span>
                    <span className="text-primary">{count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full"
                      style={{ width: `${(count / topServices[0][1]) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* أحدث الطلبات */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-extrabold mb-5">أحدث الطلبات</h2>
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد طلبات بعد.</p>
          ) : (
            <div className="space-y-4">
              {requests.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center font-black shrink-0">
                    {r.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.subject || r.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(r.created_date).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
