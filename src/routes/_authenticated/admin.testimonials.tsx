import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";

type Testimonial = {
  id: string; customer_name: string; photo: string | null; rating: number | null;
  review: string; approved: boolean; display_order: number;
};

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: () => (
    <CrudPage<Testimonial>
      table="testimonials"
      title="Testimonials"
      fields={[
        { name: "customer_name", label: "Customer name", required: true },
        { name: "review", label: "Review", type: "textarea", required: true },
        { name: "rating", label: "Rating (1-5)", type: "number" },
        { name: "photo", label: "Photo URL (optional)" },
        { name: "approved", label: "Approved (visible on site)", type: "boolean" },
        { name: "display_order", label: "Display order", type: "number", required: true },
      ]}
      summary={(t) => (
        <div>
          <div className="text-sm font-medium text-foreground">
            {t.customer_name} <span className="text-xs text-muted-foreground">★ {t.rating ?? "—"} · {t.approved ? "approved" : "pending"}</span>
          </div>
          <div className="text-xs text-muted-foreground line-clamp-2">{t.review}</div>
        </div>
      )}
    />
  ),
});
