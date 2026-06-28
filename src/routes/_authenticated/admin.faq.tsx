import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";

type Faq = { id: string; question: string; answer: string; display_order: number };

export const Route = createFileRoute("/_authenticated/admin/faq")({
  component: () => (
    <CrudPage<Faq>
      table="faq"
      title="FAQs"
      fields={[
        { name: "question", label: "Question", required: true },
        { name: "answer", label: "Answer", type: "textarea", required: true },
        { name: "display_order", label: "Display order", type: "number", required: true },
      ]}
      summary={(f) => (
        <div>
          <div className="text-sm font-medium text-foreground">{f.question}</div>
          <div className="text-xs text-muted-foreground line-clamp-2">{f.answer}</div>
        </div>
      )}
    />
  ),
});
