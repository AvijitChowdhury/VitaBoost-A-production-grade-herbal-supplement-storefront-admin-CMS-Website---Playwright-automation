import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const [state, setState] = useState<"loading" | "admin" | "not_admin">("loading");

  async function check() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) {
      setState("not_admin");
      return;
    }
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (error) {
      console.error(error);
      setState("not_admin");
      return;
    }
    setState(data ? "admin" : "not_admin");
  }

  useEffect(() => {
    check();
  }, []);


  if (state === "loading") {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state === "not_admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-leaf-gradient px-4">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow">
          <ShieldAlert className="mx-auto h-10 w-10 text-honey" />
          <h1 className="mt-3 font-display text-2xl text-foreground">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account doesn't have the admin role. Ask an existing admin to grant access.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button variant="outline" asChild>
              <Link to="/">Back to site</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 border-b border-border bg-card/60 px-4 backdrop-blur">
            <SidebarTrigger />
            <span className="font-display text-base text-foreground">Admin</span>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
