import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flame, Moon, Sunset, Users, Send, Sparkles, Languages, CalendarDays, HeartHandshake } from "lucide-react";
import { Ambient } from "@/components/Ambient";
import { AudioBar } from "@/components/AudioBar";
import { Diya } from "@/components/Diya";
import { Journey } from "@/components/Journey";
import { Thali } from "@/components/Thali";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast, Toaster } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DigiDiwali — A Virtual Place of Light" },
      { name: "description", content: "Light a virtual diya, share Diwali wishes and count down to Deepavali 2026." },
      { property: "og:title", content: "DigiDiwali — A Virtual Place of Light" },
      { property: "og:description", content: "Light a virtual diya and share blessings this Diwali." },
    ],
  }),
  component: Index,
});

const TARGET = new Date("2026-11-08T00:00:00+05:30").getTime();
type Wish = { id: string; name: string; text: string };
type Row = { id: string; name: string; message: string };
const toWish = (r: Row): Wish => ({ id: r.id, name: r.name, text: r.message });

function Index() {
  const { lang, setLang, t } = useLang();
  const hi = lang === "hi";
  const [evening, setEvening] = useState(false);
  const [left, setLeft] = useState<number | null>(null);
  const [diyas, setDiyas] = useState(0);
  const [base, setBase] = useState(0);
  const [online, setOnline] = useState(108);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setDiyas(+(localStorage.getItem("dd-diyas") ?? 0));
    supabase.from("diya_lights").select("id", { count: "exact", head: true }).then(({ count }) => setBase(count ?? 0));
    supabase.from("wishes").select("id,name,message").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => data && setWishes(data.map(toWish)));
    const ch = supabase.channel(`digidiwali-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "diya_lights" }, () => setBase((b) => b + 1))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "wishes" }, (p) => {
        const w = toWish(p.new as Row);
        setWishes((prev) => (prev.some((x) => x.id === w.id) ? prev : [w, ...prev].slice(0, 50)));
      })
      .subscribe();
    const tick = () => setLeft(Math.max(0, TARGET - Date.now()));
    tick();
    const ti = setInterval(tick, 1000);
    const o = setInterval(() => setOnline((n) => Math.max(100, n + Math.round(Math.random() * 6 - 3))), 3000);
    return () => { clearInterval(ti); clearInterval(o); supabase.removeChannel(ch); };
  }, []);
  useEffect(() => { document.documentElement.classList.toggle("evening", evening); }, [evening]);

  const light = async () => {
    const n = diyas + 1; setDiyas(n); localStorage.setItem("dd-diyas", String(n));
    const { error } = await supabase.from("diya_lights").insert({});
    if (error) toast.error(t("errDiya"));
  };
  const post = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || sending) return;
    setSending(true);
    const { data, error } = await supabase.from("wishes")
      .insert({ name: name.trim().slice(0, 40), message: text.trim().slice(0, 280) })
      .select("id,name,message").single();
    setSending(false);
    if (error || !data) return void toast.error(t("errWish"));
    const w = toWish(data);
    setWishes((prev) => (prev.some((x) => x.id === w.id) ? prev : [w, ...prev]));
    setText("");
  };

  const s = (left ?? 0) / 1000;
  const units = [["Days", s / 86400], ["Hours", (s / 3600) % 24], ["Minutes", (s / 60) % 60], ["Seconds", s % 60]] as const;
  const nav = [
    ["#aarti", hi ? "आरती मंडप" : "Aarti Sanctum", Flame],
    ["#journey", hi ? "पाँच दिन" : "5-Day Journey", CalendarDays],
    ["#diya", hi ? "दीया जलाएँ" : "Light Diya", Sparkles],
    ["#wishes", hi ? "आशीर्वाद" : "Blessings", HeartHandshake],
  ] as const;

  return (
    <div className="relative min-h-screen scroll-smooth pb-32">
      <Ambient />
      <header className="sticky top-0 z-20 border-b border-border/40 bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2 font-serif text-xl"><Flame size={20} className="text-primary" /> DigiDiwali</div>
          <nav className="order-3 flex w-full justify-center gap-1 overflow-x-auto rounded-full glass p-1 text-xs md:order-none md:w-auto">
            {nav.map(([href, label, I]) => (
              <a key={href} href={href} className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground transition hover:text-primary">
                <I size={13} /> {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full glass p-1 text-xs">
              {([[false, t("night"), Moon], [true, t("evening"), Sunset]] as const).map(([v, label, I]) => (
                <button key={String(v)} onClick={() => setEvening(v)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${evening === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  <I size={13} /> <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setLang(hi ? "en" : "hi")}
              className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-primary transition hover:glow">
              <Languages size={13} /> {hi ? "English" : "हिन्दी"}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4">
        <section className="pt-10 text-center">
          <p className="font-serif text-lg italic text-muted-foreground">{t("tagline")}</p>
          <h1 className="font-display text-7xl text-primary text-glow sm:text-8xl">{hi ? "दीपावली" : "Deepavali"}</h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-flame" /><Users size={14} />
            {online}+ {t("online")}
          </div>
          <div className="mx-auto mt-10 grid max-w-xl grid-cols-4 gap-3">
            {units.map(([l, v]) => (
              <div key={l} className="rounded-2xl glass py-4">
                <div className="font-serif text-4xl tabular-nums text-primary sm:text-5xl">{left === null ? "--" : String(Math.floor(v)).padStart(2, "0")}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t(l)}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{t("until")}</p>
        </section>

        <div id="aarti" className="scroll-mt-28"><Thali /></div>
        <div id="journey" className="scroll-mt-28"><Journey /></div>

        <section id="diya" className="mt-20 scroll-mt-28 rounded-3xl glass p-6 text-center sm:p-10">
          <h2 className="font-serif text-3xl">{t("lightTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground"><span className="text-primary">{base.toLocaleString()}</span> {t("worldwide")} · {diyas} {t("byYou")}</p>
          <button onClick={light} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground glow transition hover:scale-105 active:scale-95">
            <Sparkles size={18} /> {t("lightBtn")}
          </button>
          <div className="mt-8 flex max-h-72 flex-wrap justify-center gap-2 overflow-y-auto">
            {Array.from({ length: Math.min(diyas, 200) }, (_, i) => (
              <div key={i} className="animate-pop-in"><Diya size={36} /></div>
            ))}
            {diyas === 0 && <p className="text-sm text-muted-foreground">{t("glowHere")}</p>}
          </div>
        </section>

        <section id="wishes" className="mt-12 scroll-mt-28">
          <h2 className="text-center font-serif text-3xl">{t("wall")}</h2>
          <form onSubmit={post} className="mx-auto mt-6 grid max-w-xl gap-3 rounded-3xl glass p-5">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("yourName")} maxLength={40}
              className="rounded-xl border bg-transparent px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring" />
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t("writeWish")} maxLength={280} rows={3}
              className="resize-none rounded-xl border bg-transparent px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring" />
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 font-medium text-primary-foreground transition hover:opacity-90">
              <Send size={16} /> {sending ? t("sharing") : t("share")}
            </button>
          </form>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {wishes.map((w) => (
              <article key={w.id} className="animate-pop-in rounded-2xl glass p-5 transition hover:glow">
                <p className="font-serif text-lg leading-snug">“{w.text}”</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-primary"><Flame size={12} /> {w.name}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <AudioBar />
      <Toaster theme="dark" position="top-center" />
    </div>
  );
}
