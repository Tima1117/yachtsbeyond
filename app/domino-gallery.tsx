"use client";
import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/* Domino scroll gallery (idea: domino-gallery by DHxWhy on 21st.dev, rewritten without
   dependencies): tall photo cards lie back in 3D perspective and swing up flat toward the
   viewer one after another as the page scrolls, with a gravity curve and a small bounce.
   Scroll back and they fall again. Idle autoplay after 3.5 s without scrolling,
   reduced-motion fallback shows every card standing. */

export type DominoItem = { src: string; w: number; h: number; title: string };

const OVERLAP = 0.45;
const IDLE_MS = 3500;
const HOLD_MS = 1400;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const topple = (t: number) => {
  if (t < 0.72) { const j = t / 0.72; return j * j; }
  const p = (t - 0.72) / 0.28;
  return 1 + 0.06 * Math.sin(p * Math.PI) * (1 - p);
};
const cardProgress = (t: number, i: number, n: number) => {
  if (n <= 1) return clamp01(t);
  const y = 1 / (1 + OVERLAP * (n - 1));
  return clamp01((t - i * y * OVERLAP) / y);
};

export function DominoGallery({ items, cardWidth = 220, cardHeight = 590, gap = 18, scrollLength = 1600, standAngle = 94, autoplay = true, autoplayDuration = 2600, onSelect }: {
  items: DominoItem[]; cardWidth?: number; cardHeight?: number; gap?: number; scrollLength?: number; standAngle?: number; autoplay?: boolean; autoplayDuration?: number; onSelect?: (src: string) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);
  const [w, setW] = useState(cardWidth);
  const st = useRef({ progress: 0, shown: -1, lastScrollAt: -Infinity, auto: { t: 0, dir: 1, hold: 0 }, raf: 0, last: 0 });

  useLayoutEffect(() => {
    const el = root.current; if (!el) return;
    const fit = () => { const avail = (el.clientWidth - 48 - gap * (items.length - 1)) / Math.max(1, items.length); setW(Math.max(72, Math.min(cardWidth, Math.floor(avail)))); };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, [cardWidth, gap, items.length]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const apply = useCallback((p: number) => {
    const s = st.current; const q = Math.round(p * 1000) / 1000;
    if (q === s.shown) return; s.shown = q;
    root.current?.style.setProperty("--progress", String(q));
    for (let i = 0; i < items.length; i++) {
      const c = cards.current[i]; if (!c) continue;
      const f = reduced ? 1 : topple(cardProgress(q, i, items.length));
      c.style.setProperty("--fall", String(Math.round(f * 1000) / 1000));
      c.style.transform = `rotateX(${standAngle * (1 - f)}deg)`;
    }
  }, [items.length, standAngle, reduced]);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const s = st.current; s.shown = -1;
    const scrollProgress = () => { const r = el.getBoundingClientRect(); const d = r.height - window.innerHeight; return d <= 0 ? 0 : clamp01(-r.top / d); };
    const frame = (now: number) => {
      s.raf = 0;
      const dt = s.last ? Math.min(now - s.last, 80) : 16; s.last = now;
      let p = s.progress; let keep = false;
      const m = scrollProgress();
      const idle = now - s.lastScrollAt > IDLE_MS;
      const inView = (() => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight; })();
      if (autoplay && idle && !reduced && inView) {
        const a = s.auto;
        if (a.hold > 0) a.hold -= dt;
        else { a.t = clamp01(a.t + (dt / autoplayDuration) * a.dir); if (a.t === 1 || a.t === 0) { a.dir *= -1; a.hold = HOLD_MS; } }
        p = a.t; keep = true;
      } else {
        p = m; s.auto.t = m; s.auto.dir = m >= 0.999 ? -1 : 1; keep = autoplay && !reduced && inView;
      }
      s.progress = p; apply(p);
      if (keep && !document.hidden) s.raf = requestAnimationFrame(frame); else s.last = 0;
    };
    const kick = () => { if (!s.raf) s.raf = requestAnimationFrame(frame); };
    const onScroll = () => { s.lastScrollAt = performance.now(); kick(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", kick);
    document.addEventListener("visibilitychange", kick);
    kick();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", kick); document.removeEventListener("visibilitychange", kick); cancelAnimationFrame(s.raf); s.raf = 0; s.last = 0; };
  }, [apply, autoplay, autoplayDuration, reduced]);

  const h = Math.round((w / cardWidth) * cardHeight);
  return (
    <div ref={root} className="domino" style={{ height: `calc(100vh + ${scrollLength}px)` }}>
      <div className="domino-stage">
        <div className="domino-row" role="list" style={{ gap, perspective: 1500, perspectiveOrigin: "50% -45%" }}>
          {items.map((it, i) => (
            <div key={it.src} role="listitem" className="domino-slot" style={{ width: w, height: h }}>
              <div ref={el => { cards.current[i] = el; }} className="domino-card" style={{ transform: `rotateX(${standAngle}deg)` }}>
                <button className="domino-btn" onClick={() => onSelect?.(it.src)} aria-label={it.title}>
                  <Image src={it.src} alt={it.title} fill sizes="(max-width: 760px) 40vw, 240px" style={{ objectFit: "cover" }} />
                  <span className="domino-cap">{it.title}</span>
                </button>
              </div>
              <div className="domino-shadow" aria-hidden />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
