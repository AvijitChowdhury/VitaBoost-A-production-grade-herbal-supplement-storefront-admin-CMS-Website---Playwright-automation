import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const getLandingData = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const [product, benefits, ingredients, testimonials, faq, settings] = await Promise.all([
    supabase.from("product").select("*").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("benefits").select("*").order("display_order", { ascending: true }),
    supabase.from("ingredients").select("*").order("display_order", { ascending: true }),
    supabase
      .from("testimonials")
      .select("id,customer_name,photo,rating,review,display_order,created_at")
      .order("display_order", { ascending: true }),
    supabase.from("faq").select("*").order("display_order", { ascending: true }),
    supabase.from("settings").select("*").limit(1).maybeSingle(),
  ]);

  return {
    product: product.data,
    benefits: benefits.data ?? [],
    ingredients: ingredients.data ?? [],
    testimonials: testimonials.data ?? [],
    faq: faq.data ?? [],
    settings: settings.data,
  };
});

const orderSchema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(20).regex(/^[+\d\s\-()]+$/, "Invalid phone"),
  address: z.string().trim().min(8).max(400),
  quantity: z.number().int().min(1).max(20),
  payment_method: z.enum(["cod", "online"]),
});

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: product, error: pErr } = await supabase
      .from("product")
      .select("id,price,discount_price,stock")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (pErr || !product) throw new Error("Product unavailable");
    if (product.stock !== null && product.stock < data.quantity) {
      throw new Error("Not enough stock for that quantity");
    }
    const unit = Number(product.discount_price ?? product.price);
    const total = +(unit * data.quantity).toFixed(2);

    const { data: inserted, error } = await supabase
      .from("orders")
      .insert({
        customer_name: data.customer_name,
        phone: data.phone,
        address: data.address,
        quantity: data.quantity,
        payment_method: data.payment_method,
        total_price: total,
        status: "pending",
      })
      .select("id,total_price,created_at")
      .single();

    if (error) { console.error("submitOrder insert error", error); throw new Error(`Could not place order: ${error.message}`); }
    return { id: inserted.id, total: inserted.total_price, placed_at: inserted.created_at };
  });
