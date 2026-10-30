import { useEffect, useState } from "react";
import { Diya } from "./Diya";

type F = { id: number; x: number; y: number; sparks: { dx: number; dy: number }[] };

export function Ambient() {
  const [lamps, setLamps] = useState<{ left: number; dur: number; delay: number; size: number }[]>([]);
  const [fw, setFw] = useState<F[]>([]);

  useEffect(() => {
    setLamps(Array.from({ length: 14 }, () => ({
      left: Math.random() * 100, dur: 18 + Math.random() * 20, delay: -Math.random() * 30, size: 18 + Math.random() * 22,
    })));
    let id = 0;
    const t = setInterval(() => {
      const f: F = {
        id: id++, x: 10 + Math.random() * 80, y: 8 + Math.random() * 35,
        sparks: Array.from({ length: 18 }, (_, i) => {
          const a = (i / 18) * Math.PI * 2, r = 50 + Math.random() * 40;
          return { dx: Math.cos(a) * r, dy: Math.sin(a) * r };
        }),
      };
      setFw((p) => [...p.slice(-3), f]);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {lamps.map((l, i) => (
        <div key={i} className="absolute bottom-0 animate-float-up opacity-60"
          style={{ left: `${l.left}%`, animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s` }}>
          <Diya size={l.size} />
        </div>
      ))}
      {fw.map((f) => (
        <div key={f.id} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
          {f.sparks.map((s, i) => (
            <span key={i} className="absolute h-1 w-1 rounded-full bg-flame animate-spark glow"
              style={{ ["--dx" as string]: `${s.dx}px`, ["--dy" as string]: `${s.dy}px` }} />
          ))}
        </div>
      ))}
    </div>
  );
}
