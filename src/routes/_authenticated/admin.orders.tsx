import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: OrdersPage,
});

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  quantity: number;
  payment_method: string;
  total_price: number;
  status: string;
  created_at: string;
};

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

function OrdersPage() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as Order[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    setRows((r) => r.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function exportCsv() {
    const header = ["id","customer_name","phone","address","quantity","payment_method","total_price","status","created_at"];
    const lines = [header.join(",")];
    rows.forEach((o) => {
      lines.push(header.map((h) => JSON.stringify(String((o as Record<string, unknown>)[h] ?? ""))).join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-foreground">Orders</h1>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <button onClick={exportCsv} className="cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">Export CSV</button>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">{filtered.length} order(s)</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid h-32 place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No orders.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-2 text-left">Customer</th>
                    <th className="text-left">Phone</th>
                    <th className="text-left">Qty</th>
                    <th className="text-left">Pay</th>
                    <th className="text-right">Total</th>
                    <th className="text-left">Placed</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr key={o.id} className="border-t border-border align-top">
                      <td className="py-3">
                        <div className="font-medium text-foreground">{o.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{o.address}</div>
                      </td>
                      <td className="text-foreground">{o.phone}</td>
                      <td className="text-foreground">{o.quantity}</td>
                      <td className="text-foreground uppercase">{o.payment_method}</td>
                      <td className="text-right text-foreground">₹{Number(o.total_price).toLocaleString("en-IN")}</td>
                      <td className="text-muted-foreground">{new Date(o.created_at).toLocaleString()}</td>
                      <td>
                        <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v)}>
                          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
