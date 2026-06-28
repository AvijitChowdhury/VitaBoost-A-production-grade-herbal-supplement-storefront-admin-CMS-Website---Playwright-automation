import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package, ShoppingCart, IndianRupee, Star } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

type Stats = {
  orders: number;
  revenue: number;
  pending: number;
  testimonials: number;
  recent: Array<{ id: string; customer_name: string; total_price: number; status: string; created_at: string }>;
};

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: orders }, { count: testimonials }] = await Promise.all([
        supabase.from("orders").select("id,customer_name,total_price,status,created_at").order("created_at", { ascending: false }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
      ]);
      const list = orders ?? [];
      setStats({
        orders: list.length,
        revenue: list.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total_price), 0),
        pending: list.filter((o) => o.status === "pending").length,
        testimonials: testimonials ?? 0,
        recent: list.slice(0, 8),
      });
      setLoading(false);
    })();
  }, []);

  if (loading || !stats) {
    return <div className="grid h-64 place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  const tiles = [
    { label: "Total orders", value: stats.orders, icon: ShoppingCart },
    { label: "Revenue (₹)", value: stats.revenue.toLocaleString("en-IN"), icon: IndianRupee },
    { label: "Pending orders", value: stats.pending, icon: Package },
    { label: "Testimonials", value: stats.testimonials, icon: Star },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening with your store today.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.label}</CardTitle>
              <t.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-2xl text-foreground">{t.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent orders</CardTitle>
          <Link to="/admin/orders" className="text-sm text-secondary-foreground/80 hover:text-foreground">View all →</Link>
        </CardHeader>
        <CardContent>
          {stats.recent.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-muted-foreground">
                <tr><th className="py-2 text-left">Customer</th><th className="text-left">Status</th><th className="text-right">Total</th><th className="text-right">Placed</th></tr>
              </thead>
              <tbody>
                {stats.recent.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="py-3 text-foreground">{o.customer_name}</td>
                    <td><StatusPill status={o.status} /></td>
                    <td className="text-right text-foreground">₹{Number(o.total_price).toLocaleString("en-IN")}</td>
                    <td className="text-right text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-honey/30 text-foreground",
    confirmed: "bg-secondary/40 text-foreground",
    shipped: "bg-blue-100 text-blue-900",
    delivered: "bg-green-100 text-green-900",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${map[status] ?? "bg-muted"}`}>{status}</span>;
}
