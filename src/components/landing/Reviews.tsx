import { Star } from "lucide-react";
import { motion } from "framer-motion";

type Testimonial = {
  id: string;
  customer_name: string;
  photo: string | null;
  rating: number | null;
  review: string;
};

export function Reviews({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section id="reviews" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-secondary-foreground/80">Loved by thousands</p>
        <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">
          Real stories from real customers.
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-secondary/10"
          >
            <div className="flex items-center gap-1 text-honey">
              {Array.from({ length: t.rating ?? 5 }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-3 text-sm text-foreground">"{t.review}"</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary/30 text-sm font-semibold text-foreground">
                {t.customer_name.charAt(0)}
              </span>
              <span className="text-sm font-medium text-foreground">{t.customer_name}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
