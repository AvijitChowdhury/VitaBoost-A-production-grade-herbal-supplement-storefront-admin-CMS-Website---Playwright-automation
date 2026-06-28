import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { resolveImage } from "@/lib/landing-assets";

type Ingredient = { id: string; name: string; description: string | null; image: string | null; display_order: number };

export const Route = createFileRoute("/_authenticated/admin/ingredients")({
  component: () => (
    <CrudPage<Ingredient>
      table="ingredients"
      title="Ingredients"
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "image", label: "Image URL (https://…) or /src/assets/* path" },
        { name: "display_order", label: "Display order", type: "number", required: true },
      ]}
      summary={(i) => (
        <div className="flex items-center gap-3">
          <img src={resolveImage(i.image)} alt="" className="h-10 w-10 rounded object-cover" />
          <div>
            <div className="text-sm font-medium text-foreground">{i.name} <span className="text-xs text-muted-foreground">#{i.display_order}</span></div>
            {i.description && <div className="text-xs text-muted-foreground">{i.description}</div>}
          </div>
        </div>
      )}
    />
  ),
});
