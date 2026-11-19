import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { POLL_OPTIONS, POLL_QUESTION, castVote, votedKey, type PollOptionKey } from "@/lib/poll";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vote")({
  head: () => ({
    meta: [
      { title: "Քվեարկություն — Ի՞նչը կօգնի նվազեցնել գործազրկությունը" },
      { name: "description", content: "Ընտրեք, թե ձեր կարծիքով ինչը կօգնի նվազեցնել գործազրկությունը Հայաստանում։" },
      { property: "og:title", content: "Քվեարկություն՝ ինչը կնվազեցնի գործազրկությունը" },
      { property: "og:description", content: "Մասնակցեք ներկայացման ինտերակտիվ քվեարկությանը ձեր հեռախոսով։" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VotePage,
});

function VotePage() {
  const [choice, setChoice] = useState<PollOptionKey | null>(null);
  const [voted, setVoted] = useState<PollOptionKey | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(votedKey) as PollOptionKey | null;
    if (saved && POLL_OPTIONS.some((o) => o.key === saved)) setVoted(saved);
  }, []);

  const submit = async () => {
    if (!choice) return;
    setSending(true);
    setError("");
    try {
      await castVote(choice);
      setVoted(choice);
    } catch {
      setError("Չհաջողվեց ուղարկել։ Ստուգեք ինտերնետը և փորձեք կրկին։");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-ink text-paper">
      <header className="flex items-center gap-3 border-b border-paper/10 px-5 py-4">
        <span className="h-3 w-3 rotate-45 bg-apricot" />
        <span className="font-display text-base font-bold">Գործազրկությունը և երկրի տնտեսությունը</span>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-5 py-8">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-apricot">Ինտերակտիվ քվեարկություն</div>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight">{POLL_QUESTION}</h1>

        {voted ? (
          <div className="mt-8">
            <div className="flex items-center gap-3 rounded-2xl bg-apricot/15 p-4 text-paper">
              <CheckCircle2 className="shrink-0 text-apricot" size={28} />
              <div>
                <div className="font-semibold">Շնորհակալություն, ձեր ձայնն ընդունված է։</div>
                <div className="text-sm text-mist">Ձեր ընտրությունը՝ {POLL_OPTIONS.find((o) => o.key === voted)?.label}</div>
              </div>
            </div>
            <p className="mt-6 text-sm text-mist">Արդյունքները կցուցադրվեն ներկայացման ընթացքում՝ էկրանին։</p>
          </div>
        ) : (
          <>
            <p className="mt-3 text-mist">Ընտրեք մեկ տարբերակ, որի հետ համաձայն եք։</p>
            <div className="mt-6 space-y-3" role="radiogroup" aria-label={POLL_QUESTION}>
              {POLL_OPTIONS.map((o) => {
                const on = choice === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setChoice(o.key)}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
                      on ? "border-apricot bg-apricot/15" : "border-paper/15 bg-paper/5 hover:bg-paper/10",
                    )}
                  >
                    <span className={cn("inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", on ? "bg-apricot text-ink-deep" : "bg-paper/10 text-apricot")}>
                      <o.icon size={22} />
                    </span>
                    <span className="flex-1 font-medium">{o.label}</span>
                    <span className={cn("h-5 w-5 shrink-0 rounded-full border-2", on ? "border-apricot bg-apricot" : "border-paper/40")} />
                  </button>
                );
              })}
            </div>
            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
            <button
              type="button"
              onClick={submit}
              disabled={!choice || sending}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-apricot py-4 text-lg font-semibold text-ink-deep transition-opacity disabled:opacity-40"
            >
              {sending && <Loader2 className="animate-spin" size={20} />}
              Քվեարկել
            </button>
          </>
        )}
      </main>

      <footer className="border-t border-paper/10 px-5 py-4 text-center text-xs text-mist">
        Գործազրկությունը և երկրի տնտեսությունը
      </footer>
    </div>
  );
}
