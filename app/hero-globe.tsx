"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
export type GlobeCopy = { eyebrow:string; top:string; lines:string[]; lede:string; cta:string; cta2:string; rating:string; hint:string; badges:[string,string][]; modes?:string[] };
export function HeroGlobe({c,wa}:{c:GlobeCopy;wa:string}) {
 const root=useRef<HTMLElement>(null); const reduced=useReducedMotion();
 const [focus,setFocus]=useState(0); const [pointer,setPointer]=useState({x:0,y:0});
 const {scrollYProgress}=useScroll({target:root,offset:["start start","end start"]});
 const y=useTransform(scrollYProgress,[0,1],[0,reduced?0:65]);
 const labels=c.modes||["Panorama","On the water","In the air"];
 return <section className="sea-hero" id="top" ref={root}>
  <div className="sea-hero-inner">
   <div className="sea-copy">
    <p className="eyebrow light">{c.eyebrow}</p>
    <h1 className="ghero-title"><span className="ghero-top">{c.top}</span><span className="ghero-line">{c.lines[0]}</span></h1>
    <p className="ghero-lede">{c.lede}</p>
    <p className="ghero-rating"><span>★★★★★</span>{c.rating}</p>
    <div className="ghero-actions"><a className="btn btn-amber" href="#trips">{c.cta}</a><a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">{c.cta2}</a></div>
    <ul className="ghero-badges">{c.badges.map(([b,s])=><li key={b}><b>{b}</b><span>{s}</span></li>)}</ul>
   </div>
   <motion.div className="sea-visual" style={{y}} onPointerMove={e=>{if(reduced||e.pointerType!=="mouse")return;const r=e.currentTarget.getBoundingClientRect();setPointer({x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5})}} onPointerLeave={()=>setPointer({x:0,y:0})}>
    <motion.div className="sea-frame" animate={{rotateY:reduced?0:pointer.x*5,rotateX:reduced?0:-pointer.y*4}} transition={{duration:.6}}>
     <motion.div className="sea-photo" animate={{scale:focus===0?1.01:1.7,x:focus===1?"19%":focus===2?"-30%":"0%",y:focus===1?"-19%":focus===2?"21%":"0%"}} transition={{duration:reduced?0:1.2,ease:[.22,1,.36,1]}}>
      <Image src="/images/mustang.webp" alt={c.top} fill priority sizes="(max-width:860px) 100vw, 52vw" style={{objectFit:"cover"}} />
     </motion.div>
     <div className="sea-photo-shade" />
     {focus===0&&<><button className="sea-hotspot boat" aria-label={labels[1]} onClick={()=>setFocus(1)}><span>+</span>{labels[1]}</button><button className="sea-hotspot air" aria-label={labels[2]} onClick={()=>setFocus(2)}><span>+</span>{labels[2]}</button></>}
     <div className="sea-frame-label"><span>BATUMI · BLACK SEA</span><b>{labels[focus]}</b></div>
    </motion.div>
    <div className="sea-controls" role="group" aria-label={c.hint}>{labels.map((label,i)=><button key={label} aria-pressed={i===focus} onClick={()=>setFocus(i)}><span>0{i+1}</span>{label}</button>)}</div>
    <p className="sea-hint">{c.hint} <span>↗</span></p>
   </motion.div>
  </div>
 </section>
}
