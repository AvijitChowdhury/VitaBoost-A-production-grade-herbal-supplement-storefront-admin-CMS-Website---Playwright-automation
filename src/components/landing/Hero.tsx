import { motion } from "framer-motion";
import { ShieldCheck, Truck, Sparkles } from "lucide-react";
import { resolveImage } from "@/lib/landing-assets";

type Product = {
  name: string;
  headline: string | null;
  short_description: string | null;
  price: number;
  discount_price: number | null;
  image: string | null;
  ingredients: string | null;
};

export function Hero({ product }: { product: Product }) {
  const img = resolveImage(product.image);
  const price = Math.round(Number(product.discount_price ?? product.price));
  const original = product.discount_price ? Math.round(Number(product.price)) : null;
  const savePct = original ? Math.round(((original - price) / original) * 100) : 0;

  return (
    <section id="top" className="bg-leaf-gradient">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-20 md:grid-cols-2 md:pt-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/40 px-3 py-1 text-xs font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5" /> 100% plant-based · Ayurvedic
          </span>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-foreground md:text-6xl">
            {product.headline ?? `${product.name} — Premium Herbal Immunity Supplement`}
          </h1>
          <p className="max-w-lg text-base text-muted-foreground md:text-lg">
            {product.short_description}
          </p>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-foreground">
              ₹{price.toLocaleString("en-IN")}
            </span>
            {original && (
              <span className="text-lg text-muted-foreground line-through">
                ₹{original.toLocaleString("en-IN")}
              </span>
            )}
            {original && (
              <span className="rounded-full bg-honey/30 px-2.5 py-0.5 text-xs font-medium text-foreground">
                Save ₹{(original - price).toLocaleString("en-IN")} ({savePct}% off)
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#order"
              className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Order now
            </a>
            <a
              href="#ingredients"
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              See ingredients
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-secondary" /> Lab-tested</span>
            <span className="inline-flex items-center gap-1.5"><Truck className="h-4 w-4 text-secondary" /> Free shipping ₹999+</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-secondary" /> No preservatives</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 mx-auto h-72 w-72 rounded-full bg-secondary/30 blur-3xl md:h-96 md:w-96" />
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            <img
              src={img}
              alt={`${product.name} bottle — premium Ayurvedic herbal immunity capsules`}
              className="aspect-square w-full object-cover"
              loading="eager"
              fetchPriority="high"
              width={800}
              height={800}
            />

          </div>
          {product.ingredients && (
            <div className="mt-4 rounded-2xl border border-border bg-card/80 p-4 text-sm text-muted-foreground backdrop-blur">
              <span className="font-medium text-foreground">Inside every capsule: </span>
              {product.ingredients}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
