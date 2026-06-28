import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/product")({
  component: ProductPage,
});

type Product = {
  id: string; name: string; headline: string | null; short_description: string | null;
  description: string | null; price: number; discount_price: number | null; stock: number;
  ingredients: string | null; usage: string | null; image: string | null;
};

function ProductPage() {
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("product").select("*").limit(1).maybeSingle().then(({ data }) => {
      setP(data as Product | null);
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!p) return;
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const patch = {
      name: String(fd.get("name") ?? ""),
      headline: String(fd.get("headline") ?? ""),
      short_description: String(fd.get("short_description") ?? ""),
      description: String(fd.get("description") ?? ""),
      price: Number(fd.get("price") ?? 0),
      discount_price: fd.get("discount_price") ? Number(fd.get("discount_price")) : null,
      stock: Number(fd.get("stock") ?? 0),
      ingredients: String(fd.get("ingredients") ?? ""),
      usage: String(fd.get("usage") ?? ""),
      image: String(fd.get("image") ?? ""),
    };
    const { error } = await supabase.from("product").update(patch).eq("id", p.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Product updated");
    setP({ ...p, ...patch });
  }

  if (loading) return <div className="grid h-64 place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  if (!p) return <p>No product configured.</p>;

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <h1 className="font-display text-2xl text-foreground">Product</h1>
      <Card>
        <CardHeader><CardTitle className="text-base">Basics</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Name"><Input name="name" defaultValue={p.name} required /></Field>
          <Field label="Headline"><Input name="headline" defaultValue={p.headline ?? ""} /></Field>
          <Field label="Short description"><Textarea name="short_description" defaultValue={p.short_description ?? ""} rows={2} /></Field>
          <Field label="Long description"><Textarea name="description" defaultValue={p.description ?? ""} rows={4} /></Field>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Pricing & stock</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Field label="Price (₹)"><Input name="price" type="number" step="0.01" defaultValue={p.price} required /></Field>
          <Field label="Discount price (₹)"><Input name="discount_price" type="number" step="0.01" defaultValue={p.discount_price ?? ""} /></Field>
          <Field label="Stock"><Input name="stock" type="number" defaultValue={p.stock} required /></Field>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Content</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Ingredients summary"><Input name="ingredients" defaultValue={p.ingredients ?? ""} /></Field>
          <Field label="How to use"><Textarea name="usage" defaultValue={p.usage ?? ""} rows={3} /></Field>
          <Field label="Image URL or /src/assets path"><Input name="image" defaultValue={p.image ?? ""} /></Field>
        </CardContent>
      </Card>
      <Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}Save changes</Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
