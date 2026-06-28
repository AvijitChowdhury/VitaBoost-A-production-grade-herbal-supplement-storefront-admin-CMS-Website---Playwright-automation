import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";

type Benefit = { id: string; title: string; description: string | null; icon: string; display_order: number };

export const Route = createFileRoute("/_authenticated/admin/benefits")({
  component: () => (
    <CrudPage<Benefit>
      table="benefits"
      title="Benefits"
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "icon", label: "Lucide icon name", placeholder: "Leaf, Heart, Sparkles…", required: true },
        { name: "display_order", label: "Display order", type: "number", required: true },
      ]}
      summary={(b) => (
        <div>
          <div className="text-sm font-medium text-foreground">{b.title} <span className="text-xs text-muted-foreground">#{b.display_order} · {b.icon}</span></div>
          {b.description && <div className="text-xs text-muted-foreground">{b.description}</div>}
        </div>
      )}
    />
  ),
});
