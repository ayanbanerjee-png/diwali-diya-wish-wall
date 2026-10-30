import { useEffect, useRef, useState } from "react";
import { Pause, Play, Waves, Music2, SkipBack, SkipForward, ListMusic, BookOpen, X } from "lucide-react";
import { TRACKS } from "@/lib/content";
import { useLang } from "@/lib/i18n";

const LENGTH = 180;

// Synthesized devotional melodies over a tanpura drone, routed through echo + reverb.
export function AudioBar() {
  const { lang, t } = useLang();
  const ctxRef = useRef<AudioContext | null>(null);
  const nodes = useRef<{ echoGain: GainNode; wet: GainNode; dry: GainNode; delay: DelayNode } | null>(null);
  const timer = useRef<number | null>(null);
  const startAt = useRef(0);
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [echo, setEcho] = useState(true);
  const [reverb, setReverb] = useState(40);
  const [pos, setPos] = useState(0);
  const [panel, setPanel] = useState<"list" | "lyrics" | null>(null);

  const teardown = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null; nodes.current = null;
  };

  const build = (idx: number) => {
    const tr = TRACKS[idx]!;
    const ctx = new AudioContext();
    const master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
    const bus = ctx.createGain();
    const dry = ctx.createGain(); bus.connect(dry); dry.connect(master);
    const conv = ctx.createConvolver();
    const len = ctx.sampleRate * 3.5, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5); }
    conv.buffer = ir;
    const wet = ctx.createGain(); bus.connect(conv); conv.connect(wet); wet.connect(master);
    const delay = ctx.createDelay(2); delay.delayTime.value = 0.45;
    const fb = ctx.createGain(); fb.gain.value = 0.45;
    const echoGain = ctx.createGain();
    bus.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(echoGain); echoGain.connect(master);
    const r = tr.root / 2;
    [r, r * 1.5, r * 2, r * 1.003].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = i === 3 ? "sawtooth" : "triangle"; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = i === 3 ? 0.012 : 0.04;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.1 + i * 0.07;
      const lg = ctx.createGain(); lg.gain.value = 0.015; lfo.connect(lg); lg.connect(g.gain); lfo.start();
      const lp = ctx.createBiquadFilter(); lp.frequency.value = 1200;
      o.connect(lp); lp.connect(g); g.connect(bus); o.start();
    });
    let step = 0;
    const note = () => {
      const now = ctx.currentTime;
      const deg = tr.scale[Math.abs(Math.round(Math.sin(step * 0.9) * 3 + Math.cos(step * 0.37) * 3)) % tr.scale.length] ?? 0;
      const f = tr.root * Math.pow(2, deg / 12);
      const bellLike = idx === TRACKS.length - 1;
      [1, bellLike ? 2.76 : 2, bellLike ? 5.4 : 3].forEach((m, k) => {
        const o = ctx.createOscillator(); o.type = bellLike ? "sine" : "triangle"; o.frequency.value = f * m;
        const g = ctx.createGain(); const a = (bellLike ? 0.1 : 0.07) / (k + 1);
        g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(a, now + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, now + tr.tempo * (bellLike ? 1.3 : 2));
        o.connect(g); g.connect(bus); o.start(now); o.stop(now + 3);
      });
      step++;
    };
    timer.current = window.setInterval(note, tr.tempo * 1000);
    ctxRef.current = ctx; startAt.current = ctx.currentTime;
    nodes.current = { echoGain, wet, dry, delay };
  };

  useEffect(() => {
    const n = nodes.current; if (!n) return;
    n.echoGain.gain.value = echo ? 0.5 : 0;
    n.wet.gain.value = (reverb / 100) * 1.5;
    n.dry.gain.value = 1 - reverb / 200;
    n.delay.delayTime.value = 0.25 + (reverb / 100) * 0.5;
  }, [echo, reverb, playing, track]);

  useEffect(() => {
    if (!playing) return;
    const i = setInterval(() => {
      const c = ctxRef.current; if (!c) return;
      const p = c.currentTime - startAt.current;
      if (p >= LENGTH) select((track + 1) % TRACKS.length, true); else setPos(p);
    }, 500);
    return () => clearInterval(i);
  }, [playing, track]);

  useEffect(() => () => teardown(), []);

  const select = (idx: number, play = playing) => {
    teardown(); setTrack(idx); setPos(0);
    if (play) { build(idx); void ctxRef.current!.resume(); setPlaying(true); }
  };

  const toggle = async () => {
    if (!ctxRef.current) build(track);
    const ctx = ctxRef.current!;
    if (playing) { await ctx.suspend(); setPlaying(false); } else { await ctx.resume(); setPlaying(true); }
  };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const cur = TRACKS[track]!;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30">
      {panel && (
        <div className="mx-auto mb-2 max-h-[55vh] max-w-5xl overflow-y-auto rounded-2xl glass p-5 animate-pop-in" style={{ animationDuration: ".25s" }}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-xl">{panel === "list" ? t("playlist") : `${t("lyrics")} · ${cur.title[lang]}`}</h3>
            <button onClick={() => setPanel(null)} aria-label="Close" className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>
          {panel === "list" ? (
            <ul className="grid gap-1 sm:grid-cols-2">
              {TRACKS.map((tr, k) => (
                <li key={k}>
                  <button onClick={() => select(k, true)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${k === track ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                    <span className="w-4 text-xs opacity-70">{k + 1}</span>{tr.title[lang]}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <p className="whitespace-pre-line font-display text-lg leading-relaxed text-primary">{cur.lyricsHi}</p>
              <p className="whitespace-pre-line font-serif text-base italic leading-relaxed text-muted-foreground">{cur.lyricsEn}</p>
            </div>
          )}
        </div>
      )}
      <div className="glass border-x-0 border-b-0">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <button onClick={() => select((track + TRACKS.length - 1) % TRACKS.length)} aria-label="Previous" className="text-muted-foreground hover:text-foreground"><SkipBack size={18} /></button>
          <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}
            className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground glow transition hover:scale-105">
            {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button onClick={() => select((track + 1) % TRACKS.length)} aria-label="Next" className="text-muted-foreground hover:text-foreground"><SkipForward size={18} /></button>
          <div className="min-w-[160px] flex-1">
            <div className="flex items-center gap-2 text-sm"><Music2 size={14} className="text-primary" /> {cur.title[lang]}</div>
            <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{fmt(pos)}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary transition-all" style={{ width: `${(pos / LENGTH) * 100}%` }} />
              </div>
              <span>{fmt(LENGTH)}</span>
            </div>
          </div>
          <button onClick={() => setPanel(panel === "list" ? null : "list")} aria-label={t("playlist")}
            className={`rounded-full border p-2 transition ${panel === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><ListMusic size={14} /></button>
          <button onClick={() => setPanel(panel === "lyrics" ? null : "lyrics")} aria-label={t("lyrics")}
            className={`rounded-full border p-2 transition ${panel === "lyrics" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><BookOpen size={14} /></button>
          <button onClick={() => setEcho((e) => !e)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${echo ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            <Waves size={14} /> {t("echo")}
          </button>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            {t("reverb")}
            <input type="range" min={0} max={100} value={reverb} onChange={(e) => setReverb(+e.target.value)} className="w-20 accent-primary" />
          </label>
        </div>
      </div>
    </div>
  );
}
