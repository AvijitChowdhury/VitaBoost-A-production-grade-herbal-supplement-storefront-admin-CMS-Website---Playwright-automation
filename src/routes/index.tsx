import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { getLandingData } from "@/lib/landing.functions";
import { resolveImage } from "@/lib/landing-assets";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Benefits } from "@/components/landing/Benefits";
import { Ingredients } from "@/components/landing/Ingredients";
import { HowToUse } from "@/components/landing/HowToUse";
import { Reviews } from "@/components/landing/Reviews";
import { FaqSection } from "@/components/landing/FaqSection";
import { OrderForm } from "@/components/landing/OrderForm";
import { Footer } from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const landingQuery = queryOptions({
  queryKey: ["landing"],
  queryFn: () => getLandingData(),
  staleTime: 60_000,
});

const SITE_URL = "https://vitaboostavijit.lovable.app";
const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/4b6f579a-cdf0-4db3-b6ce-afd8bc2fab57";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(landingQuery),
  head: () => ({
    meta: [
      { title: "VitaBoost+ — Ayurvedic Immunity Capsules with Tulsi, Ashwagandha & Amla" },
      {
        name: "description",
        content:
          "Daily herbal immunity capsules made with Tulsi, Ashwagandha, Ginger, Turmeric, Amla & Giloy. Lab-tested, 100% plant-based, Cash on Delivery available across India.",
      },
      { property: "og:title", content: "VitaBoost+ — Ayurvedic Immunity Capsules" },
      {
        property: "og:description",
        content: "Six time-honoured herbs in one daily capsule. Lab-tested. Cash on Delivery available.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:title", content: "VitaBoost+ — Ayurvedic Immunity Capsules" },
      { name: "twitter:description", content: "Six time-honoured herbs in one daily capsule. Lab-tested." },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: LandingPage,
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
});

function LandingPage() {
  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const { data } = useSuspenseQuery(landingQuery);
  const { product, benefits, ingredients, testimonials, faq, settings } = data;

  if (!product || !settings) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center text-muted-foreground">
        Product not configured yet.
      </div>
    );
  }

  const ldjson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.description ?? undefined,
    image: typeof window !== "undefined" ? window.location.origin + resolveImage(product.image) : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: Number(product.discount_price ?? product.price),
      availability: (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }} />
      <Nav storeName={settings.store_name} />
      <main>
        <Hero product={product} />
        <Benefits items={benefits} />
        <Ingredients items={ingredients} />
        <HowToUse usage={product.usage} />
        <Reviews items={testimonials} />
        <FaqSection items={faq} />
        <section id="order" className="bg-leaf-gradient">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-secondary-foreground/80">Order</p>
              <h2 className="mt-2 font-display text-3xl text-foreground md:text-4xl">
                Start your wellness journey today.
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Cash on Delivery available. Free shipping on orders above ₹999. Delivered in 3–5 business days.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>✓ 30-day satisfaction guarantee</li>
                <li>✓ Free shipping over ₹999</li>
                <li>✓ Discreet packaging</li>
              </ul>
            </div>
            <OrderForm product={product} />
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </div>
  );
}
