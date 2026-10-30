import { useEffect, useRef, useState } from "react";
import { Pause, Play, Waves, Music2 } from "lucide-react";

const LENGTH = 180; // seconds per loop

// Synthesized ambient raga drone with temple bells, routed through echo + reverb.
export function AudioBar() {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodes = useRef<{ echoGain: GainNode; wet: GainNode; dry: GainNode; delay: DelayNode } | null>(null);
  const bellTimer = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [echo, setEcho] = useState(true);
  const [reverb, setReverb] = useState(40);
  const [pos, setPos] = useState(0);

  const build = () => {
    const ctx = new AudioContext();
    const master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
    const bus = ctx.createGain();
    const dry = ctx.createGain(); bus.connect(dry); dry.connect(master);
    // reverb
    const conv = ctx.createConvolver();
    const len = ctx.sampleRate * 3.5, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5); }
    conv.buffer = ir;
    const wet = ctx.createGain(); bus.connect(conv); conv.connect(wet); wet.connect(master);
    // echo
    const delay = ctx.createDelay(2); delay.delayTime.value = 0.45;
    const fb = ctx.createGain(); fb.gain.value = 0.45;
    const echoGain = ctx.createGain();
    bus.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(echoGain); echoGain.connect(master);
    // drone (Sa-Pa-Sa)
    [130.81, 196, 261.63, 130.81 * 1.003].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = i === 3 ? "sawtooth" : "triangle"; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = i === 3 ? 0.015 : 0.05;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.1 + i * 0.07;
      const lg = ctx.createGain(); lg.gain.value = 0.02; lfo.connect(lg); lg.connect(g.gain); lfo.start();
      const lp = ctx.createBiquadFilter(); lp.frequency.value = 1200;
      o.connect(lp); lp.connect(g); g.connect(bus); o.start();
    });
    const scale = [261.63, 293.66, 329.63, 392, 440, 523.25];
    const bell = () => {
      const t = ctx.currentTime, f = (scale[Math.floor(Math.random() * scale.length)] ?? 261.63) * 2;
      [1, 2.76, 5.4].forEach((m, k) => {
        const o = ctx.createOscillator(); o.frequency.value = f * m;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.12 / (k + 1), t); g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
        o.connect(g); g.connect(bus); o.start(t); o.stop(t + 3);
      });
    };
    bellTimer.current = window.setInterval(bell, 2400);
    ctxRef.current = ctx;
    nodes.current = { echoGain, wet, dry, delay };
  };

  useEffect(() => {
    const n = nodes.current; if (!n) return;
    n.echoGain.gain.value = echo ? 0.5 : 0;
    n.wet.gain.value = (reverb / 100) * 1.5;
    n.dry.gain.value = 1 - reverb / 200;
    n.delay.delayTime.value = 0.25 + (reverb / 100) * 0.5;
  }, [echo, reverb, playing]);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPos((ctxRef.current?.currentTime ?? 0) % LENGTH), 500);
    return () => clearInterval(t);
  }, [playing]);

  useEffect(() => () => { if (bellTimer.current) clearInterval(bellTimer.current); ctxRef.current?.close(); }, []);

  const toggle = async () => {
    if (!ctxRef.current) build();
    const ctx = ctxRef.current!;
    if (playing) { await ctx.suspend(); setPlaying(false); } else { await ctx.resume(); setPlaying(true); }
  };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 glass border-x-0 border-b-0">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3">
        <button onClick={toggle} aria-label={playing ? "Pause" : "Play"}
          className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground glow transition hover:scale-105">
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <div className="min-w-[180px] flex-1">
          <div className="flex items-center gap-2 text-sm"><Music2 size={14} className="text-primary" /> Deepavali Aarti — Temple Ambience</div>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{fmt(pos)}</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${(pos / LENGTH) * 100}%` }} />
            </div>
            <span>{fmt(LENGTH)}</span>
          </div>
        </div>
        <button onClick={() => setEcho((e) => !e)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${echo ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
          <Waves size={14} /> Temple Echo
        </button>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Reverb/Delay
          <input type="range" min={0} max={100} value={reverb} onChange={(e) => setReverb(+e.target.value)} className="w-24 accent-primary" />
        </label>
      </div>
    </div>
  );
}
