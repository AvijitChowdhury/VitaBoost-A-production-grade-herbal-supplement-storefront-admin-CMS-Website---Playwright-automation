import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Leaf, Flame, Droplet, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SITE_URL = "https://vitaboostavijit.lovable.app";

type Dosha = "vata" | "pitta" | "kapha";

type Question = {
  q: string;
  options: { label: string; dosha: Dosha }[];
};

const QUESTIONS: Question[] = [
  {
    q: "Which best describes your body frame?",
    options: [
      { label: "Thin, light, hard to gain weight", dosha: "vata" },
      { label: "Medium, muscular, athletic", dosha: "pitta" },
      { label: "Broad, sturdy, gains weight easily", dosha: "kapha" },
    ],
  },
  {
    q: "How is your skin most of the year?",
    options: [
      { label: "Dry, rough, cool to touch", dosha: "vata" },
      { label: "Warm, sensitive, prone to redness", dosha: "pitta" },
      { label: "Thick, smooth, oily", dosha: "kapha" },
    ],
  },
  {
    q: "How would you describe your appetite?",
    options: [
      { label: "Irregular — sometimes I forget to eat", dosha: "vata" },
      { label: "Strong and sharp — I get hangry", dosha: "pitta" },
      { label: "Steady but low — I can skip meals easily", dosha: "kapha" },
    ],
  },
  {
    q: "Your typical energy pattern is…",
    options: [
      { label: "Bursts of energy, then I crash", dosha: "vata" },
      { label: "Focused, driven, intense", dosha: "pitta" },
      { label: "Steady, calm, slow to start", dosha: "kapha" },
    ],
  },
  {
    q: "How do you handle stress?",
    options: [
      { label: "I get anxious and overthink", dosha: "vata" },
      { label: "I get irritable and frustrated", dosha: "pitta" },
      { label: "I withdraw and shut down", dosha: "kapha" },
    ],
  },
  {
    q: "Your sleep is usually…",
    options: [
      { label: "Light, interrupted, restless", dosha: "vata" },
      { label: "Sound but short, wake up warm", dosha: "pitta" },
      { label: "Deep, long, hard to get out of bed", dosha: "kapha" },
    ],
  },
  {
    q: "Which climate do you prefer?",
    options: [
      { label: "Warm and humid — I dislike cold wind", dosha: "vata" },
      { label: "Cool and breezy — I dislike heat", dosha: "pitta" },
      { label: "Warm and dry — I dislike damp cold", dosha: "kapha" },
    ],
  },
  {
    q: "When it comes to immunity, you…",
    options: [
      { label: "Catch colds easily when seasons change", dosha: "vata" },
      { label: "Get inflammation, rashes, or heartburn", dosha: "pitta" },
      { label: "Deal with congestion and sinus issues", dosha: "kapha" },
    ],
  },
];

const DOSHA_INFO: Record<
  Dosha,
  { name: string; icon: typeof Leaf; tagline: string; body: string; recommend: string[] }
> = {
  vata: {
    name: "Vata",
    icon: Leaf,
    tagline: "Air & Ether — light, mobile, creative",
    body:
      "Vata types thrive on warmth, routine, and grounding. When Vata is out of balance you may feel anxious, dry, or depleted. Ashwagandha and Tulsi in VitaBoost+ help calm the nervous system and rebuild stamina.",
    recommend: ["Ashwagandha", "Tulsi", "Ginger"],
  },
  pitta: {
    name: "Pitta",
    icon: Flame,
    tagline: "Fire & Water — focused, sharp, driven",
    body:
      "Pitta types run hot and need cooling, soothing herbs. When Pitta is aggravated you may feel irritated, inflamed, or burnt out. Amla and Turmeric in VitaBoost+ cool internal heat and support liver detox.",
    recommend: ["Amla", "Turmeric", "Giloy"],
  },
  kapha: {
    name: "Kapha",
    icon: Droplet,
    tagline: "Earth & Water — steady, strong, nurturing",
    body:
      "Kapha types are grounded but can feel heavy or congested. When Kapha builds up you may feel sluggish or catch mucus-heavy colds. Ginger, Tulsi and Giloy in VitaBoost+ kindle metabolism and clear congestion.",
    recommend: ["Ginger", "Tulsi", "Giloy"],
  },
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a dosha in Ayurveda?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "In Ayurveda, a dosha is one of three biological energies — Vata, Pitta, and Kapha — that govern your body and mind. Most people have one or two dominant doshas that shape their constitution.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is an online dosha quiz?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "An online quiz gives a directional read on your prakriti (constitution) based on self-reported traits. For a full assessment, consult a qualified Ayurvedic practitioner.",
      },
    },
    {
      "@type": "Question",
      name: "Which Ayurvedic immunity booster is right for me?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "VitaBoost+ combines Tulsi, Ashwagandha, Ginger, Turmeric, Amla and Giloy so it supports all three doshas. Your dominant dosha simply tells you which of those herbs you'll feel the most from.",
      },
    },
  ],
};

export const Route = createFileRoute("/dosha-quiz")({
  head: () => ({
    meta: [
      { title: "Free Ayurvedic Dosha Quiz — Discover Your Body Type | VitaBoost+" },
      {
        name: "description",
        content:
          "Take our free 8-question Ayurvedic dosha quiz to find out if you are Vata, Pitta, or Kapha — and see which herbal immunity booster suits your constitution.",
      },
      { property: "og:title", content: "Free Ayurvedic Dosha Quiz — Vata, Pitta or Kapha?" },
      {
        property: "og:description",
        content:
          "8 quick questions to reveal your Ayurvedic body type and a personalised herbal immunity recommendation.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE_URL}/dosha-quiz` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Free Ayurvedic Dosha Quiz" },
      {
        name: "twitter:description",
        content: "Find out if you're Vata, Pitta, or Kapha in 8 questions.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/dosha-quiz` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(FAQ_JSONLD),
      },
    ],
  }),
  component: DoshaQuizPage,
});

function DoshaQuizPage() {
  const [answers, setAnswers] = useState<(Dosha | null)[]>(() => QUESTIONS.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    const tally: Record<Dosha, number> = { vata: 0, pitta: 0, kapha: 0 };
    answers.forEach((a) => {
      if (a) tally[a] += 1;
    });
    const winner = (Object.entries(tally) as [Dosha, number][]).sort((a, b) => b[1] - a[1])[0][0];
    return { tally, winner };
  }, [answers]);

  const answeredCount = answers.filter(Boolean).length;
  const progress = Math.round((answeredCount / QUESTIONS.length) * 100);

  function selectAnswer(qIdx: number, dosha: Dosha) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = dosha;
      return next;
    });
  }

  function reset() {
    setAnswers(QUESTIONS.map(() => null));
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    const info = DOSHA_INFO[result.winner];
    const Icon = info.icon;
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Your result</p>
          <div className="mt-3 flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <Icon className="h-7 w-7" />
            </span>
            <div>
              <h1 className="font-display text-4xl text-foreground">You are {info.name}</h1>
              <p className="text-muted-foreground">{info.tagline}</p>
            </div>
          </div>

          <p className="mt-6 text-base leading-relaxed text-foreground">{info.body}</p>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-display text-xl">Your dosha breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["vata", "pitta", "kapha"] as Dosha[]).map((d) => {
                const pct = Math.round((result.tally[d] / QUESTIONS.length) * 100);
                return (
                  <div key={d}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium capitalize text-foreground">{d}</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="mt-6 border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Herbs that suit your {info.name} constitution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="mb-4 flex flex-wrap gap-2">
                {info.recommend.map((h) => (
                  <li
                    key={h}
                    className="rounded-full border border-primary/30 bg-background px-3 py-1 text-sm text-foreground"
                  >
                    {h}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                All three of these herbs are inside every VitaBoost+ capsule, alongside Turmeric, Amla and
                Giloy — a single daily dose formulated for all doshas.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/" hash="order">
                    Try VitaBoost+ <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" onClick={reset}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Retake quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-14">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to VitaBoost+
        </Link>
        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
          Ayurvedic Dosha Quiz
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Ayurveda teaches that everyone is a mix of three doshas — Vata, Pitta and Kapha. Answer these
          8 quick questions to discover your dominant dosha and see which herbal immunity booster suits
          your body type.
        </p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>
              {answeredCount} / {QUESTIONS.length}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ol className="mt-8 space-y-6">
          {QUESTIONS.map((q, i) => (
            <li key={i}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    {i + 1}. {q.q}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {q.options.map((opt) => {
                      const active = answers[i] === opt.dosha;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => selectAnswer(i, opt.dosha)}
                          className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                            active
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                          }`}
                          aria-pressed={active}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {answeredCount < QUESTIONS.length
              ? `Answer ${QUESTIONS.length - answeredCount} more to see your result.`
              : "All done — see your dosha result."}
          </p>
          <Button
            size="lg"
            disabled={answeredCount < QUESTIONS.length}
            onClick={() => {
              setSubmitted(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            See my dosha <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <section className="mt-14 border-t border-border pt-8">
          <h2 className="font-display text-2xl text-foreground">About the three doshas</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {(["vata", "pitta", "kapha"] as Dosha[]).map((d) => {
              const info = DOSHA_INFO[d];
              const Icon = info.icon;
              return (
                <div key={d} className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-lg text-foreground">{info.name}</h3>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {info.tagline}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{info.body}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
