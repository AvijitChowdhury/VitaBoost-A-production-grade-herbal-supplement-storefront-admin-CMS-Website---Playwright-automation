import { Leaf } from "lucide-react";

export function Nav({ storeName }: { storeName: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#top" className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          {storeName}
        </a>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#benefits" className="hover:text-foreground">Benefits</a>
          <a href="#ingredients" className="hover:text-foreground">Ingredients</a>
          <a href="#reviews" className="hover:text-foreground">Reviews</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <a
          href="#order"
          className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          Order now
        </a>
      </div>
    </header>
  );
}
