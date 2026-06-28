import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

type Settings = {
  id: string; store_name: string; logo: string | null; phone: string | null; email: string | null;
  facebook: string | null; instagram: string | null; whatsapp: string | null;
};

function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("settings").select("*").limit(1).maybeSingle().then(({ data }) => setS(data as Settings | null));
  }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!s) return;
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const patch = {
      store_name: String(fd.get("store_name") ?? ""),
      logo: String(fd.get("logo") ?? "") || null,
      phone: String(fd.get("phone") ?? "") || null,
      email: String(fd.get("email") ?? "") || null,
      facebook: String(fd.get("facebook") ?? "") || null,
      instagram: String(fd.get("instagram") ?? "") || null,
      whatsapp: String(fd.get("whatsapp") ?? "") || null,
    };
    const { error } = await supabase.from("settings").update(patch).eq("id", s.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    setS({ ...s, ...patch });
  }

  if (!s) return <div className="grid h-64 place-items-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4">
      <h1 className="font-display text-2xl text-foreground">Settings</h1>
      <Card>
        <CardHeader><CardTitle className="text-base">Storefront</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {([
            ["store_name", "Store name"],
            ["logo", "Logo URL"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["facebook", "Facebook URL"],
            ["instagram", "Instagram URL"],
            ["whatsapp", "WhatsApp number"],
          ] as const).map(([n, l]) => (
            <div key={n} className="space-y-1.5">
              <Label htmlFor={n}>{l}</Label>
              <Input id={n} name={n} defaultValue={(s[n] as string) ?? ""} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} Save</Button>
    </form>
  );
}
