"use client";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export type DayCopy = {
  eyebrow: string;
  title: string;
  lede: string;
  stops: { time: string; title: string; text: string }[];
  facts: { b: string; s: string }[];
  cta: string;
};

const BoatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v9" />
    <path d="M12 3c3 2.5 4.5 5.5 4.5 9H12" />
    <path d="M12 12H7.5C7.5 8.5 9 5.5 12 3" />
    <path d="M4 15h16l-2 4H6z" />
    <path d="M3 21c2 0 2 1.5 4 1.5s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5 1.5 1.5 2 1.5" />
  </svg>
);

/* "Your hour on the water": sticky facts column + timeline whose line fills on real scroll
   and a raft icon that travels along it. */
export function DaySection({ c, wa }: { c: DayCopy; wa: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 70%"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const lineScale = useTransform(p, [0, 1], [0, 1]);
  const raftTop = useTransform(p, v => `${v * 100}%`);
  const facts = ["/images/harness.webp", "/images/captain.webp", "/images/crew.webp"];

  return (
    <section className="day" id="day">
      <div className="container day-grid">
        <div className="day-side">
          <div className="day-sticky">
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="section-title">{c.title}</h2>
            <p className="section-lede">{c.lede}</p>
            <div className="day-facts">
              {c.facts.map((f, i) => (
                <motion.div className="day-fact" key={f.b} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <Image src={facts[i]} alt="" width={96} height={96} sizes="96px" />
                  <div><b>{f.b}</b><span>{f.s}</span></div>
                </motion.div>
              ))}
            </div>
            <a className="btn btn-wa" href={wa} target="_blank" rel="noopener noreferrer">{c.cta}</a>
          </div>
        </div>

        <ol className="day-list" ref={listRef}>
          <div className="day-line"><motion.div className="day-line-fill" style={{ scaleY: lineScale }} /></div>
          <motion.div className="day-raft" style={{ top: raftTop }}><BoatIcon /></motion.div>
          {c.stops.map((s, i) => (
            <motion.li key={s.time} className="day-stop" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-20% 0px -20% 0px" }} transition={{ duration: 0.55, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}>
              <span className="day-dot" />
              <time>{s.time}</time>
              <div className="day-stop-body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
