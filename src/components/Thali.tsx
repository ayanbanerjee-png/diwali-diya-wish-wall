import { useRef, useState } from "react";
import { Bell, Flower2, RotateCw } from "lucide-react";
import { useLang } from "@/lib/i18n";

type Petal = { id: number; left: number; dur: number; delay: number; rose: boolean; size: number };

export function Thali() {
  const { lang } = useLang();
  const [spin, setSpin] = useState(false);
  const [ring, setRing] = useState(0);
  const [petals, setPetals] = useState<Petal[]>([]);
  const ctx = useRef<AudioContext | null>(null);
  const L = (en: string, hi: string) => (lang === "hi" ? hi : en);

  const bell = () => {
    const c = (ctx.current ??= new AudioContext());
    void c.resume();
    const t = c.currentTime, f = 523.25;
    [[1, 0.3], [2.01, 0.15], [2.76, 0.12], [5.4, 0.06], [8.93, 0.03]].forEach(([m, a]) => {
      const o = c.createOscillator(); o.frequency.value = f * m!;
      const g = c.createGain(); g.gain.setValueAtTime(a!, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 4 / m! + 1);
      o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 5);
    });
    setRing((r) => r + 1);
  };

  const shower = () => {
    const base = Date.now();
    const batch = Array.from({ length: 40 }, (_, k) => ({
      id: base + k, left: Math.random() * 100, dur: 5 + Math.random() * 4, delay: Math.random() * 2, rose: Math.random() < 0.4, size: 10 + Math.random() * 10,
    }));
    setPetals((p) => [...p, ...batch]);
    setTimeout(() => setPetals((p) => p.filter((x) => x.id < base || x.id >= base + 40)), 11000);
  };

  return (
    <section className="mt-20 rounded-3xl glass p-6 text-center sm:p-10">
      <h2 className="font-serif text-3xl">{L("Aarti Sanctum", "आरती मंडप")}</h2>
      <div className="mx-auto mt-8 grid h-64 w-64 place-items-center">
        <svg viewBox="0 0 200 200" className={`h-full w-full ${spin ? "animate-aarti" : ""}`} aria-label={L("Brass aarti thali", "पीतल की आरती थाली")}>
          <defs>
            <radialGradient id="brass" cx="40%" cy="35%"><stop offset="0%" stopColor="var(--primary)" /><stop offset="100%" stopColor="var(--accent)" /></radialGradient>
            <radialGradient id="halo"><stop offset="0%" stopColor="var(--flame)" stopOpacity=".8" /><stop offset="100%" stopColor="var(--flame)" stopOpacity="0" /></radialGradient>
          </defs>
          <circle cx="100" cy="100" r="92" fill="url(#brass)" stroke="var(--primary)" strokeWidth="3" />
          <circle cx="100" cy="100" r="78" fill="none" stroke="var(--primary-foreground)" strokeOpacity=".35" strokeDasharray="3 5" />
          {/* kumkum & chawal */}
          <circle cx="78" cy="118" r="11" fill="var(--kumkum)" />
          <g fill="var(--foreground)">{Array.from({ length: 12 }, (_, k) => <ellipse key={k} cx={118 + (k % 4) * 4} cy={114 + Math.floor(k / 4) * 4} rx="1.6" ry="0.9" />)}</g>
          {/* flowers */}
          {[[60, 70], [140, 70], [100, 150]].map(([x, y], k) => (
            <g key={k}>{Array.from({ length: 6 }, (_, p) => <circle key={p} cx={x! + Math.cos(p) * 6} cy={y! + Math.sin(p) * 6} r="5" fill="var(--marigold)" />)}<circle cx={x} cy={y} r="3" fill="var(--kumkum)" /></g>
          ))}
          {/* pancha pradeep */}
          {Array.from({ length: 5 }, (_, k) => {
            const a = (k / 5) * Math.PI * 2 - Math.PI / 2, x = 100 + Math.cos(a) * 30, y = 100 + Math.sin(a) * 30;
            return (
              <g key={k}>
                <circle cx={x} cy={y - 6} r="12" fill="url(#halo)" />
                <ellipse cx={x} cy={y} rx="7" ry="4" fill="var(--accent)" stroke="var(--primary)" />
                <path d={`M${x} ${y - 14} C${x + 4} ${y - 8} ${x + 3} ${y - 3} ${x} ${y - 2} C${x - 3} ${y - 3} ${x - 4} ${y - 8} ${x} ${y - 14}Z`} fill="var(--flame)" className="animate-flicker" style={{ transformBox: "fill-box" }} />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={() => setSpin((s) => !s)} className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition ${spin ? "bg-primary text-primary-foreground glow" : "border hover:bg-muted"}`}>
          <RotateCw size={16} /> {L("Rotate Thali", "आरती करें")}
        </button>
        <button onClick={bell} className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition hover:bg-muted">
          <Bell key={ring} size={16} className={ring ? "animate-bell" : ""} /> {L("Ring Bell", "घंटी बजाएं")}
        </button>
        <button onClick={shower} className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition hover:bg-muted">
          <Flower2 size={16} /> {L("Shower Flowers", "पुष्प वर्षा")}
        </button>
      </div>
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
        {petals.map((p) => (
          <span key={p.id} className="absolute -top-6 animate-petal rounded-[60%_0]"
            style={{ left: `${p.left}%`, width: p.size, height: p.size, background: p.rose ? "var(--kumkum)" : "var(--marigold)", animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />
        ))}
      </div>
    </section>
  );
}
