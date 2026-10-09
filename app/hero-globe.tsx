"use client";

import {useCallback,useEffect,useRef,useState} from "react";
import {useMotionValueEvent,useReducedMotion,useScroll} from "framer-motion";
import MarineScene, {type MarineDrive} from "./marine-scene";
export type GlobeCopy={eyebrow:string;top:string;lines:string[];lede:string;cta:string;cta2:string;rating:string;hint:string;badges:[string,string][];modes?:string[]};
export function HeroGlobe({c,wa}:{c:GlobeCopy;wa:string}){
 const root=useRef<HTMLElement>(null);const reduced=useReducedMotion();const [ready,setReady]=useState(false);const [active,setActive]=useState(true);const [supported,setSupported]=useState<boolean|null>(null);const [p,setP]=useState(0);const [dragging,setDragging]=useState(false);
 const drive=useRef<MarineDrive>({p:0,x:0,y:0,drag:0,reduced:false});const down=useRef<number|null>(null);
 const {scrollYProgress}=useScroll({target:root,offset:["start start","end end"]});
 useMotionValueEvent(scrollYProgress,"change",v=>{drive.current.p=v;setP(v)});
 useEffect(()=>{drive.current.reduced=!!reduced;},[reduced]);
 useEffect(()=>{try{const cv=document.createElement("canvas");const gl=cv.getContext("webgl2");setSupported(!!gl);gl?.getExtension("WEBGL_lose_context")?.loseContext();}catch{setSupported(false)}},[]);
 useEffect(()=>{const el=root.current;if(!el)return;const io=new IntersectionObserver(([entry])=>setActive(entry.isIntersecting));io.observe(el);return()=>io.disconnect()},[]);
 const loaded=useCallback(()=>setReady(true),[]);
 const labels=c.modes||["At sea","Above it all","Your escape"];
 const jump=(i:number)=>{if(!root.current)return;const r=root.current.getBoundingClientRect();window.scrollTo({top:window.scrollY+r.top+(root.current.offsetHeight-innerHeight)*i/2,behavior:reduced?"instant":"smooth"})};
 const chapter=p<.34?0:p<.72?1:2;
 return <section ref={root} className={`voyage-hero${reduced?" reduced":""}`} id="top" aria-label={c.top} data-scene-state={ready?"ready":supported===false?"fallback":"loading"}>
  <div className="voyage-stage">
   <div className="voyage-halo"/>
   <div className="voyage-type" aria-hidden style={{transform:`translateX(${-p*18}vw) translateY(${-p*12}vh)`,opacity:1-p*.9}}>YACHTS</div>
   <div className="voyage-type second" aria-hidden style={{transform:`translateX(${p*20}vw)`,opacity:1-p*.8}}>&amp; BEYOND</div>
   <div className={`voyage-canvas${dragging?" dragging":""}`} onPointerDown={e=>{if(reduced)return;down.current=e.clientX;setDragging(true);e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();drive.current.x=(e.clientX-r.left)/r.width-.5;drive.current.y=(e.clientY-r.top)/r.height-.5;if(down.current!==null){drive.current.drag+=(e.clientX-down.current)*.005;down.current=e.clientX}}} onPointerUp={()=>{down.current=null;setDragging(false)}} onPointerCancel={()=>{down.current=null;setDragging(false)}}>
    <div className="voyage-poster" style={{opacity:ready&&supported?0:1}}><picture><source media="(max-width:760px)" srcSet="/images/scene-mobile.webp"/><img src="/images/scene-desktop.webp" alt="" fetchPriority="high" className="voyage-first-frame"/></picture></div>
    {supported&&<MarineScene drive={drive} onReady={loaded} active={active}/>}
   </div>
   <div className="voyage-shade"/>
   <div className="voyage-meta"><p className="eyebrow light">{c.eyebrow}</p><span>{c.hint} ↔</span></div>
   <div className={`voyage-copy${chapter===2?" final":""}`}>
    <p className="voyage-chapter"><span>0{chapter+1}</span> {labels[chapter]}</p>
    <h1>{chapter===0?c.lines[1]:chapter===1?c.lines[0]:c.lines[2]}</h1>
    <p className="voyage-description" style={{maxHeight:chapter===2?120:0,opacity:chapter===2?1:0}}>{c.lede}</p>
    <div className="ghero-actions"><a className="btn btn-amber" href="#trips">{c.cta}</a><a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">{c.cta2}</a></div>
   </div>
   <div className="voyage-status"><span className="voyage-coordinate">41°39′ N · 41°38′ E</span><span>BATUMI · BLACK SEA</span><p><b>4.5</b> ★ Google</p></div>
   <div className="voyage-timeline" role="group" aria-label={c.top}>{labels.map((label,i)=><button key={i} onClick={()=>jump(i)} aria-pressed={chapter===i}><span>0{i+1}</span><i style={{transform:`scaleX(${Math.min(1,Math.max(0,p*3-i))})`}}/><b>{label}</b></button>)}</div>
  </div>
 </section>
}
