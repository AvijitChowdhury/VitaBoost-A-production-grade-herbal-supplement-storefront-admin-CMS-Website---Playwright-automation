import { Facebook, Instagram, MessageCircle, Mail, Phone } from "lucide-react";

type Settings = {
  store_name: string;
  email: string | null;
  phone: string | null;
  facebook: string | null;
  instagram: string | null;
  whatsapp: string | null;
};

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl">{settings.store_name}</p>
          <p className="mt-2 text-sm opacity-80">
            Premium herbal supplements crafted in small batches.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium opacity-80">Contact</p>
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 opacity-90 hover:opacity-100">
              <Phone className="h-4 w-4" /> {settings.phone}
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 opacity-90 hover:opacity-100">
              <Mail className="h-4 w-4" /> {settings.email}
            </a>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium opacity-80">Follow</p>
          <div className="flex gap-3">
            {settings.facebook && (
              <a href={settings.facebook} aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {settings.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} aria-label="WhatsApp" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs opacity-70">
        © {new Date().getFullYear()} {settings.store_name}. All rights reserved. ·{" "}
        <a href="/auth" className="underline">Admin</a>
      </div>
    </footer>
  );
}
