"use client";
import Image from "next/image";
import {useEffect,useRef,useState} from "react";
import {useReducedMotion} from "framer-motion";
export type DominoItem={src:string;w:number;h:number;title:string};
export function DominoGallery({items,onSelect,labels}:{items:DominoItem[];onSelect?:(src:string)=>void;labels:string[]}){
 const rail=useRef<HTMLDivElement>(null);const group=useRef<HTMLDivElement>(null); const [paused,setPaused]=useState(false); const pausedRef=useRef(false);const hovering=useRef(false);const until=useRef(0);const reduced=useReducedMotion();
 useEffect(()=>{pausedRef.current=paused},[paused]);
 useEffect(()=>{const el=rail.current;const g=group.current;if(!el||!g)return;let raf=0,last=0;let width=g.offsetWidth;let position=width;el.scrollLeft=width;let applied=el.scrollLeft;
 const resize=new ResizeObserver(()=>{width=g.offsetWidth;position=width;el.scrollLeft=width;applied=el.scrollLeft});resize.observe(g);
 const frame=(now:number)=>{const dt=last?Math.min(now-last,50):0;last=now;if(Math.abs(el.scrollLeft-applied)>1)position=el.scrollLeft;if(!pausedRef.current&&!reduced&&!hovering.current&&now>until.current&&!document.hidden){position-=dt*.027;el.scrollLeft=position;}if(el.scrollLeft<1){position+=width;el.scrollLeft=position;}else if(el.scrollLeft>=width*2){position-=width;el.scrollLeft=position;}applied=el.scrollLeft;raf=requestAnimationFrame(frame)};
 raf=requestAnimationFrame(frame);return()=>{cancelAnimationFrame(raf);resize.disconnect()};
 },[reduced,items.length]);
 const move=(d:number)=>{until.current=performance.now()+4500;rail.current?.scrollBy({left:d*(window.innerWidth<760?260:330),behavior:reduced?"instant":"smooth"})};
 return <div className="photo-gallery">
  <div className="gallery-toolbar container"><span>{items.length} {labels[0]}</span><div><button onClick={()=>move(-1)} aria-label={labels[1]}>←</button><button className="gallery-pause" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?labels[4]:labels[3]}</button><button onClick={()=>move(1)} aria-label={labels[2]}>→</button></div></div>
  <div className="photo-rail" ref={rail} onMouseEnter={()=>{hovering.current=true}} onMouseLeave={()=>{hovering.current=false}} onFocusCapture={()=>{hovering.current=true}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))hovering.current=false}} onTouchStart={()=>{until.current=performance.now()+8000}}>
   {[0,1,2].map(copy=><div className="photo-group" ref={copy===0?group:undefined} key={copy}>{items.map((it,i)=><button key={it.src} className="photo-card" onClick={()=>onSelect?.(it.src)} aria-label={it.title} tabIndex={copy===1?0:-1}>
    <Image src={it.src} alt={it.title} fill sizes="(max-width:760px) 240px, 310px" style={{objectFit:"cover"}} />
    <span className="photo-number">{String(i+1).padStart(2,"0")}</span><span className="photo-caption">{it.title}<span>↗</span></span>
   </button>)}</div>)}
  </div>
 </div>
}
