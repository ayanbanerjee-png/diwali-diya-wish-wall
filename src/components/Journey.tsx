import { useState } from "react";
import { Clock, Sparkles } from "lucide-react";
import { DAYS } from "@/lib/content";
import { useLang } from "@/lib/i18n";

export function Journey() {
  const { lang, t } = useLang();
  const [i, setI] = useState(2);
  const d = DAYS[i]!;
  return (
    <section className="mt-20">
      <h2 className="text-center font-serif text-3xl">{t("journey")}</h2>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {DAYS.map((x, k) => (
          <button key={k} onClick={() => setI(k)}
            className={`rounded-full px-4 py-2 text-xs transition ${k === i ? "bg-primary text-primary-foreground glow" : "glass text-muted-foreground hover:text-foreground"}`}>
            {t("day")} {k + 1} · {x.name[lang]}
          </button>
        ))}
      </div>
      <article key={i} className="mx-auto mt-6 max-w-3xl animate-pop-in rounded-3xl glass p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{d.date[lang]}</p>
        <h3 className="mt-1 font-display text-4xl text-primary text-glow">{d.name[lang]}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{d.about[lang]}</p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"><Clock size={12} className="text-primary" /> {d.time[lang]}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="font-serif text-xl">{t("rituals")}</h4>
            <ol className="mt-2 space-y-2 text-sm">
              {d.rituals.map((r, k) => (
                <li key={k} className="flex gap-3"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{k + 1}</span>{r[lang]}</li>
              ))}
            </ol>
          </div>
          <div className="grid place-items-center rounded-2xl border p-4 text-center">
            <Sparkles size={16} className="text-primary" />
            <p className="mt-2 font-display text-2xl text-primary">{d.mantra}</p>
          </div>
        </div>
      </article>
    </section>
  );
}
