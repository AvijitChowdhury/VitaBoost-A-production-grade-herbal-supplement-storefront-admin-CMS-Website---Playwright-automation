import { motion } from "framer-motion";
import { resolveImage } from "@/lib/landing-assets";

type Ingredient = { id: string; name: string; description: string | null; image: string | null };

export function Ingredients({ items }: { items: Ingredient[] }) {
  return (
    <section id="ingredients" className="bg-mint-wash">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-secondary-foreground/80">Inside the bottle</p>
          <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">
            Six time-honoured herbs. Nothing else.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {items.map((ing, i) => (
            <motion.figure
              key={ing.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-secondary/10"
            >
              <div className="overflow-hidden">
                <img
                  src={resolveImage(ing.image)}
                  alt={ing.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="p-5">
                <h3 className="font-display text-lg text-foreground">{ing.name}</h3>
                {ing.description && (
                  <p className="mt-1.5 text-sm text-muted-foreground">{ing.description}</p>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
