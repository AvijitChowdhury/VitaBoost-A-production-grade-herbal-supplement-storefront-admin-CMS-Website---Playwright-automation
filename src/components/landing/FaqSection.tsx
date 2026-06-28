import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Faq = { id: string; question: string; answer: string };

export function FaqSection({ items }: { items: Faq[] }) {
  if (!items.length) return null;
  return (
    <section id="faq" className="bg-mint-wash">
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-secondary-foreground/80">FAQ</p>
          <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">Questions, answered.</h2>
        </div>
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-6">
          {items.map((f) => (
            <AccordionItem key={f.id} value={f.id} className="border-b last:border-b-0">
              <AccordionTrigger className="text-left text-base font-medium text-foreground">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
