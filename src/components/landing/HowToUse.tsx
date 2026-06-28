import { Pill, GlassWater, CalendarCheck } from "lucide-react";

export function HowToUse({ usage }: { usage: string | null }) {
  const steps = [
    { icon: Pill, title: "Take 2 capsules", text: "One after breakfast, one after dinner." },
    { icon: GlassWater, title: "With water", text: "Always with a full glass of water." },
    { icon: CalendarCheck, title: "Stay consistent", text: "Use daily for 4–6 weeks to feel the change." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-secondary-foreground/80">How to use</p>
        <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">
          Three simple steps, every day.
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-honey/30">
              <s.icon className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="font-display text-lg text-foreground">
              <span className="mr-2 text-honey-foreground">{i + 1}.</span>
              {s.title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>
      {usage && (
        <p className="mt-8 max-w-3xl rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          {usage}
        </p>
      )}
    </section>
  );
}
