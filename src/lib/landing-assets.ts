import hero from "@/assets/hero-product.jpg";
import tulsi from "@/assets/ing-tulsi.jpg";
import ashwagandha from "@/assets/ing-ashwagandha.jpg";
import ginger from "@/assets/ing-ginger.jpg";
import turmeric from "@/assets/ing-turmeric.jpg";
import amla from "@/assets/ing-amla.jpg";
import giloy from "@/assets/ing-giloy.jpg";

const bundled: Record<string, string> = {
  "/src/assets/hero-product.jpg": hero,
  "/src/assets/ing-tulsi.jpg": tulsi,
  "/src/assets/ing-ashwagandha.jpg": ashwagandha,
  "/src/assets/ing-ginger.jpg": ginger,
  "/src/assets/ing-turmeric.jpg": turmeric,
  "/src/assets/ing-amla.jpg": amla,
  "/src/assets/ing-giloy.jpg": giloy,
};

/** Resolve a stored image path to a usable URL. Supports bundled assets and external URLs. */
export function resolveImage(path: string | null | undefined, fallback = hero): string {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return bundled[path] ?? fallback;
}

export { hero as heroImageDefault };
