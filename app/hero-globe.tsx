"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* Hero "& Beyond": a large dotted globe (land = 9k points) that turns on its own, follows a
   drag, tilts to the mouse and zooms out as the page scrolls. Batumi glows on the Black Sea
   with three route arcs going "beyond". Idea of the banded headline with cycling phrases
   comes from ink-orbit-hero (21st.dev); the sculpture is replaced with the globe. */

export type GlobeCopy = {
  eyebrow: string;
  top: string;
  lines: string[];
  lede: string;
  cta: string;
  cta2: string;
  rating: string;
  hint: string;
  badges: [string, string][];
};

const BATUMI = { lat: 41.6436, lon: 41.6399 };
const BEYOND = [
  { lat: 41.0082, lon: 28.9784 },  // Istanbul
  { lat: 43.5855, lon: 39.7231 },  // Sochi
  { lat: 46.4825, lon: 30.7233 },  // Odesa
];
const R = 1;
const d2r = Math.PI / 180;
const toVec = (lat: number, lon: number, r = R) => new THREE.Vector3(r * Math.cos(lat * d2r) * Math.sin(lon * d2r), r * Math.sin(lat * d2r), r * Math.cos(lat * d2r) * Math.cos(lon * d2r));

function dotTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.45, "rgba(255,255,255,0.95)"); grd.addColorStop(0.7, "rgba(255,255,255,0.25)"); grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c); tex.needsUpdate = true; return tex;
}

type Drive = { spin: number; tiltX: number; tiltY: number; p: number; dragging: boolean; vx: number };

function Land({ drive, accent, land }: { drive: React.MutableRefObject<Drive>; accent: string; land: Float32Array | null }) {
  const outer = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => dotTexture(), []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    if (land) g.setAttribute("position", new THREE.BufferAttribute(land, 3));
    return g;
  }, [land]);
  const arcs = useMemo(() => BEYOND.map(b => {
    const a = toVec(BATUMI.lat, BATUMI.lon, 1.005), e = toVec(b.lat, b.lon, 1.005);
    const mid = a.clone().add(e).multiplyScalar(0.5); const len = a.distanceTo(e);
    mid.normalize().multiplyScalar(1 + len * 0.45);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, e);
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
  }), []);
  const batumi = useMemo(() => toVec(BATUMI.lat, BATUMI.lon, 1.01), []);
  const baseRot = useMemo(() => new THREE.Euler(BATUMI.lat * d2r, -BATUMI.lon * d2r, 0, "XYZ"), []);

  useFrame((st, dt) => {
    const d = drive.current;
    if (!d.dragging) { d.vx *= 0.94; d.spin += (0.045 + d.vx) * dt; } else { d.spin += d.vx * dt; }
    if (outer.current) {
      outer.current.rotation.y = d.spin;
      const s = 1 + d.p * 0.55;
      outer.current.scale.setScalar(s);
      outer.current.position.y = -d.p * 0.9;
    }
    if (tilt.current) {
      tilt.current.rotation.x += ((d.tiltY * 0.25) - tilt.current.rotation.x) * 0.06;
      tilt.current.rotation.z += ((-d.tiltX * 0.12) - tilt.current.rotation.z) * 0.06;
    }
    const tm = st.clock.elapsedTime;
    if (ring.current) { const k = 1 + ((tm * 0.9) % 1) * 1.6; ring.current.scale.setScalar(k); (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.75 * (1 - ((tm * 0.9) % 1)); }
    if (halo.current) (halo.current.material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(tm * 2.2) * 0.2;
  });

  const lookAt = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), batumi.clone().normalize()), [batumi]);

  return (
    <group ref={tilt}>
      <group ref={outer}>
        <group rotation={baseRot}>
          <mesh>
            <sphereGeometry args={[R * 0.985, 64, 64]} />
            <meshPhongMaterial color="#0a1326" emissive="#07101f" specular="#1d3b6a" shininess={22} transparent opacity={0.96} />
          </mesh>
          <mesh scale={1.035}>
            <sphereGeometry args={[R, 48, 48]} />
            <meshBasicMaterial color={accent} transparent opacity={0.06} side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          {land && (
            <points geometry={geo}>
              <pointsMaterial map={tex} color="#eef4ff" size={0.021} sizeAttenuation transparent opacity={0.95} alphaTest={0.05} depthWrite={false} />
            </points>
          )}
          {arcs.map((g, i) => (
            <line key={i}>
              <primitive object={g} attach="geometry" />
              <lineBasicMaterial color={accent} transparent opacity={0.55} linewidth={1} />
            </line>
          ))}
          <group position={batumi} quaternion={lookAt}>
            <mesh ref={halo}><circleGeometry args={[0.028, 32]} /><meshBasicMaterial color={accent} transparent opacity={0.7} depthWrite={false} /></mesh>
            <mesh ref={ring}><ringGeometry args={[0.03, 0.036, 48]} /><meshBasicMaterial color={accent} transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} /></mesh>
            <mesh position={[0, 0, 0.002]}><circleGeometry args={[0.012, 24]} /><meshBasicMaterial color="#ffffff" /></mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

function Scene({ drive, accent, land, mobile }: { drive: React.MutableRefObject<Drive>; accent: string; land: Float32Array | null; mobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[-3, 2, 4]} intensity={1.1} color="#9fc2ff" />
      <directionalLight position={[4, -1, -2]} intensity={0.35} color={accent} />
      <group position={[mobile ? 0 : 0.1, mobile ? -0.1 : -0.02, 0]} scale={mobile ? 0.86 : 0.98}>
        <Land drive={drive} accent={accent} land={land} />
      </group>
    </>
  );
}

export function HeroGlobe({ c, wa, accent = "#c6f135" }: { c: GlobeCopy; wa: string; accent?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [land, setLand] = useState<Float32Array | null>(null);
  const [webgl, setWebgl] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [idx, setIdx] = useState(0);
  const [swap, setSwap] = useState(false);
  const drive = useRef<Drive>({ spin: 0, tiltX: 0, tiltY: 0, p: 0, dragging: false, vx: 0 });
  const drag = useRef({ on: false, x: 0, t: 0 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", v => { drive.current.p = v; ref.current?.style.setProperty("--p", v.toFixed(4)); });

  useEffect(() => {
    try { const cv = document.createElement("canvas"); setWebgl(!!(cv.getContext("webgl2") || cv.getContext("webgl"))); } catch { setWebgl(false); }
    const u = () => setMobile(window.innerWidth < 860); u();
    window.addEventListener("resize", u);
    fetch("/data/land.json").then(r => r.json()).then((pts: [number, number][]) => {
      const arr = new Float32Array(pts.length * 3);
      pts.forEach(([lat, lon], i) => { const v = toVec(lat, lon); arr[i * 3] = v.x; arr[i * 3 + 1] = v.y; arr[i * 3 + 2] = v.z; });
      setLand(arr);
    }).catch(() => {});
    return () => window.removeEventListener("resize", u);
  }, []);

  useEffect(() => {
    if (reduced || c.lines.length < 2) return;
    const t = setInterval(() => { setSwap(true); setTimeout(() => { setIdx(i => (i + 1) % c.lines.length); setSwap(false); }, 380); }, 4200);
    return () => clearInterval(t);
  }, [c.lines.length, reduced]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => { drive.current.tiltX = (e.clientX / window.innerWidth - 0.5) * 2; drive.current.tiltY = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  const onDown = (e: React.PointerEvent) => { drag.current = { on: true, x: e.clientX, t: performance.now() }; drive.current.dragging = true; drive.current.vx = 0; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); };
  const onMoveP = (e: React.PointerEvent) => { if (!drag.current.on) return; const dx = e.clientX - drag.current.x; const now = performance.now(); const dt = Math.max(8, now - drag.current.t); drive.current.vx = (dx / dt) * 3.2; drive.current.spin += dx * 0.005; drag.current = { on: true, x: e.clientX, t: now }; };
  const onUp = () => { drag.current.on = false; drive.current.dragging = false; };

  return (
    <section className="ghero" ref={ref} id="top" aria-label="Yachts & Beyond">
      <div className="ghero-stage">
        <div className="ghero-bg" aria-hidden />
        <div className={`ghero-globe${webgl && !reduced ? "" : " static"}`} onPointerDown={onDown} onPointerMove={onMoveP} onPointerUp={onUp} onPointerCancel={onUp} onPointerLeave={onUp}>
          {webgl && !reduced ? (
            <Canvas dpr={[1, 1.6]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} camera={{ position: [0, 0, 3.3], fov: 40, near: 0.1, far: 50 }} onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}>
              <Scene drive={drive} accent={accent} land={land} mobile={mobile} />
            </Canvas>
          ) : <div className="ghero-fallback" />}
        </div>
        <div className="ghero-copy">
          <p className="eyebrow light">{c.eyebrow}</p>
          <h1 className="ghero-title">
            <span className="ghero-top">{c.top}</span>
            <span className={`ghero-line${swap ? " out" : ""}`} key={idx}>{c.lines[idx]}</span>
          </h1>
          <p className="ghero-lede">{c.lede}</p>
          <p className="ghero-rating"><span>★★★★★</span>{c.rating}</p>
          <div className="ghero-actions">
            <a className="btn btn-amber" href="#trips">{c.cta}</a>
            <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">{c.cta2}</a>
          </div>
          <ul className="ghero-badges">
            {c.badges.map(([b, s]) => <li key={b}><b>{b}</b><span>{s}</span></li>)}
          </ul>
        </div>
        <div className="ghero-hint" aria-hidden><span>{c.hint}</span><span className="ghero-hint-dot">↓</span></div>
      </div>
    </section>
  );
}
