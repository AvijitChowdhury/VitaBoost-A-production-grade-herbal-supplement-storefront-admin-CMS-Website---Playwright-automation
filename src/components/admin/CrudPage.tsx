import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export type FieldDef<T> = {
  name: keyof T & string;
  label: string;
  type?: "text" | "textarea" | "number" | "image" | "boolean";
  required?: boolean;
  placeholder?: string;
};

type Row = Record<string, unknown> & { id: string };

export function CrudPage<T extends Row>({
  table, title, fields, summary, orderBy = "display_order",
}: {
  table: string;
  title: string;
  fields: FieldDef<T>[];
  summary: (row: T) => ReactNode;
  orderBy?: string;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null>(null);
  const [open, setOpen] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("*").order(orderBy, { ascending: true });
    if (error) toast.error(error.message);
    setRows((data as T[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {};
    fields.forEach((f) => {
      const v = fd.get(f.name);
      if (f.type === "number") payload[f.name] = v === "" || v === null ? null : Number(v);
      else if (f.type === "boolean") payload[f.name] = fd.get(f.name) === "on";
      else payload[f.name] = v === "" ? null : String(v ?? "");
    });
    const op = editing
      ? supabase.from(table).update(payload).eq("id", editing.id)
      : supabase.from(table).insert(payload);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success(editing ? "Saved" : "Created");
    setOpen(false); setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-foreground">{title}</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}><Plus className="h-4 w-4" /> New</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} {title.slice(0,-1)}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              {fields.map((f) => (
                <div key={f.name} className="space-y-1.5">
                  <Label htmlFor={f.name}>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea id={f.name} name={f.name} rows={3} defaultValue={String(editing?.[f.name] ?? "")} required={f.required} placeholder={f.placeholder} />
                  ) : f.type === "boolean" ? (
                    <input id={f.name} name={f.name} type="checkbox" defaultChecked={Boolean(editing?.[f.name])} className="h-4 w-4 cursor-pointer" />
                  ) : (
                    <Input id={f.name} name={f.name} type={f.type === "number" ? "number" : "text"} step={f.type === "number" ? "any" : undefined}
                      defaultValue={editing?.[f.name] == null ? "" : String(editing[f.name])} required={f.required} placeholder={f.placeholder} />
                  )}
                </div>
              ))}
              <DialogFooter>
                <Button type="submit">{editing ? "Save" : "Create"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">{rows.length} item(s)</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid h-32 place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Nothing here yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0 flex-1">{summary(r)}</div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setOpen(true); }} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(r.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
