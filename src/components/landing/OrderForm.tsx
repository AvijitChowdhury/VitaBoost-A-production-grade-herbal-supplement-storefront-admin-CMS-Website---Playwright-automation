import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitOrder } from "@/lib/landing.functions";

type Product = { name: string; price: number; discount_price: number | null; stock: number };

export function OrderForm({ product }: { product: Product }) {
  const submit = useServerFn(submitOrder);
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState<"cod" | "online">("cod");
  const [done, setDone] = useState<{ id: string; total: number } | null>(null);

  const unit = Number(product.discount_price ?? product.price);
  const total = (unit * qty).toFixed(2);

  const mutation = useMutation({
    mutationFn: async (form: FormData) => {
      const payload = {
        customer_name: String(form.get("customer_name") ?? "").trim(),
        phone: String(form.get("phone") ?? "").trim(),
        address: String(form.get("address") ?? "").trim(),
        quantity: qty,
        payment_method: payment,
      };
      return submit({ data: payload });
    },
    onSuccess: (res) => {
      setDone({ total: Number(res.total) });
      toast.success("Order placed! We'll reach out to confirm.");
    },
    onError: (e: Error) => toast.error(e.message ?? "Could not place order"),
  });

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-secondary" />
        <h3 className="mt-4 font-display text-2xl text-foreground">Order confirmed</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Reference <span className="font-mono text-foreground">{done.id.slice(0, 8)}</span> · Total ₹{done.total.toLocaleString("en-IN")}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Our team will call you within 24 hours to confirm delivery details.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(new FormData(e.currentTarget));
      }}
      className="space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="customer_name">Full name</Label>
          <Input id="customer_name" name="customer_name" required minLength={2} maxLength={80} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" required minLength={7} maxLength={20} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address">Delivery address</Label>
        <Textarea id="address" name="address" required minLength={8} maxLength={400} rows={3} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="qty">Quantity</Label>
          <div className="flex items-center rounded-md border border-input">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="h-10 w-10 cursor-pointer text-lg text-muted-foreground hover:text-foreground"
              aria-label="Decrease"
            >
              −
            </button>
            <input
              id="qty"
              value={qty}
              onChange={(e) => setQty(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
              className="h-10 w-full bg-transparent text-center text-sm focus:outline-none"
              inputMode="numeric"
            />
            <button
              type="button"
              onClick={() => setQty(Math.min(20, qty + 1))}
              className="h-10 w-10 cursor-pointer text-lg text-muted-foreground hover:text-foreground"
              aria-label="Increase"
            >
              +
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Payment</Label>
          <RadioGroup value={payment} onValueChange={(v) => setPayment(v as "cod" | "online")} className="flex gap-3">
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-input p-3 text-sm has-[:checked]:border-secondary has-[:checked]:bg-secondary/10">
              <RadioGroupItem value="cod" /> Cash on delivery
            </label>
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-input p-3 text-sm has-[:checked]:border-secondary has-[:checked]:bg-secondary/10">
              <RadioGroupItem value="online" /> Online
            </label>
          </RadioGroup>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="font-display text-xl font-semibold text-foreground">₹{Number(total).toLocaleString("en-IN")}</span>
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={mutation.isPending}
        className="w-full rounded-full"
      >
        {mutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing order…</> : "Place order"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        By ordering you agree to our terms. We never share your phone number.
      </p>
    </form>
  );
}
