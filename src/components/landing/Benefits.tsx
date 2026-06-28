import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Benefit = { id: string; title: string; description: string | null; icon: string };

function iconFor(name: string): LucideIcon {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[name];
  return Icon ?? Icons.Leaf;
}

export function Benefits({ items }: { items: Benefit[] }) {
  return (
    <section id="benefits" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-secondary-foreground/80">Why VitaBoost+</p>
        <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">
          A daily ritual your body will thank you for.
        </h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b, i) => {
          const Icon = iconFor(b.icon);
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-lg hover:shadow-secondary/10"
            >
              <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-secondary/40 to-secondary/10 text-primary transition group-hover:from-secondary/60 group-hover:to-secondary/20">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg text-foreground">{b.title}</h3>
              {b.description && <p className="mt-2 text-sm text-muted-foreground">{b.description}</p>}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
