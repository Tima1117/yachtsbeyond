"use client";
import {Canvas,useFrame} from "@react-three/fiber";
import {Environment,Lightformer,RoundedBox} from "@react-three/drei";
import {memo,useEffect,useMemo,useRef} from "react";
import * as T from "three";
export type MarineDrive={p:number;x:number;y:number;drag:number;reduced:boolean};
const CORAL="#eea18e";
function hullGeometry(){
 const vs:number[]=[],ix:number[]=[];const n=64,m=28;
 for(let i=0;i<=n;i++){const u=i/n,x=-4+u*8;const beam=.98*(u<.65?.9+.1*Math.sin(u/.65*Math.PI/2):Math.sqrt(Math.max(.002,1-Math.pow((u-.65)/.35,1.4))));
 for(let j=0;j<=m;j++){const a=j/m*Math.PI;vs.push(x,.38-Math.sin(a)*(.65+.23*Math.sin(u*Math.PI)),Math.cos(a)*beam)}}
 for(let i=0;i<n;i++)for(let j=0;j<m;j++){const a=i*(m+1)+j,b=a+m+1;ix.push(a,b,a+1,b,b+1,a+1)}
 const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(vs,3));g.setIndex(ix);g.computeVertexNormals();return g;
}
function deckShape(scale=1){const s=new T.Shape();s.moveTo(-4,-.88*scale);s.lineTo(-4,.88*scale);s.bezierCurveTo(-1.6,1.1*scale,2.6,1.15*scale,4,.04);s.quadraticCurveTo(4.08,0,4,-.04);s.bezierCurveTo(2.6,-1.15*scale,-1.6,-1.1*scale,-4,-.88*scale);return s;}
function Tube({points,r=.018,color="#d6e3e6"}:{points:number[][];r?:number;color?:string}){const geom=useMemo(()=>new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),48,r,6,false),[points,r]);return <mesh geometry={geom}><meshStandardMaterial color={color} metalness={.78} roughness={.22}/></mesh>}
function Yacht(){
 const hull=useMemo(hullGeometry,[]);const deck=useMemo(()=>new T.ExtrudeGeometry(deckShape(),{depth:.12,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.04,bevelThickness:.025,curveSegments:32}),[]);
 const cabin=useMemo(()=>{const s=new T.Shape();s.moveTo(-1.95,.48);s.lineTo(-1.3,1.38);s.quadraticCurveTo(-1.2,1.48,-.9,1.48);s.lineTo(.85,1.45);s.lineTo(1.8,.48);s.closePath();return new T.ExtrudeGeometry(s,{depth:1.34,bevelEnabled:true,bevelSize:.055,bevelThickness:.04,bevelSegments:3})},[]);
 const glass=useMemo(()=>{const s=new T.Shape();s.moveTo(-1.62,.73);s.lineTo(-1.18,1.31);s.lineTo(.73,1.3);s.lineTo(1.37,.73);s.closePath();return new T.ShapeGeometry(s)},[]);
 const windscreen=useMemo(()=>{const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute([.99,1.33,-.56,.99,1.33,.56,1.59,.73,-.56,1.59,.73,.56],3));g.setIndex([0,2,1,1,2,3]);g.computeVertexNormals();return g},[]);
 return <group>
  <mesh geometry={windscreen}><meshPhysicalMaterial color="#183645" metalness={.68} roughness={.12} clearcoat={1} side={T.DoubleSide}/></mesh>
  <Tube points={[[1.,1.33,0],[1.6,.73,0]]} r={.018} color="#dedbd2"/>
  <mesh geometry={hull}><meshPhysicalMaterial color="#e8e2d7" metalness={.32} roughness={.23} clearcoat={1} side={T.DoubleSide}/></mesh>
  <mesh geometry={deck} rotation={[-Math.PI/2,0,0]} position={[0,.38,0]}><meshStandardMaterial color="#e8dfd0" roughness={.4}/></mesh>
  <RoundedBox args={[1.65,.11,1.55]} radius={.07} position={[-3.18,.53,0]}><meshStandardMaterial color="#a67d60" roughness={.7}/></RoundedBox>
  {Array.from({length:10},(_,i)=><mesh key={i} position={[-3.18,.591,-.7+i*.15]}><boxGeometry args={[1.5,.008,.008]}/><meshStandardMaterial color="#715741"/></mesh>)}
  <mesh geometry={cabin} position={[0,0,-.67]}><meshPhysicalMaterial color="#eee8df" roughness={.24} metalness={.2} clearcoat={1}/></mesh>
  {[-1,1].map(side=><group key={side}>
   <mesh geometry={glass} position={[0,0,side*.726]}><meshPhysicalMaterial color="#173542" metalness={.72} roughness={.12} clearcoat={1} side={T.DoubleSide}/></mesh>
   <Tube points={[[-3.9,.4,side*.9],[-1.8,.41,side*1.01],[1,.4,side*.99],[3,.39,side*.62],[3.9,.4,side*.1]]} r={.027} color="#343c43"/>
   <Tube points={[[-2.7,.95,side*.94],[-1,.95,side*1],[1.6,.94,side*.94],[3,.87,side*.62],[3.9,.76,side*.08]]} r={.019}/>
   {[-2.6,-1.3,0,1.4,2.7].map((x,i)=><Tube key={x} points={[[x,.5,side*(i===4?.7:.94)],[x,.95,side*(i===4?.7:.94)]]} r={.015}/>)}
   {[-2.8,-2.25,-1.7].map(x=><mesh key={x} position={[x,.08,side*.951]} rotation={[Math.PI/2,0,0]}><capsuleGeometry args={[.06,.15,4,8]}/><meshStandardMaterial color="#172e3e" metalness={.7} roughness={.2}/></mesh>)}
  </group>)}
  <RoundedBox args={[2.6,.11,1.58]} position={[-.25,1.53,0]} radius={.05}><meshPhysicalMaterial color="#faf0df" metalness={.2} roughness={.2}/></RoundedBox>
  <RoundedBox args={[1.28,.2,1.25]} position={[2.3,.63,0]} radius={.09}><meshStandardMaterial color="#cf9a83" roughness={.8}/></RoundedBox>
  <RoundedBox args={[.5,.42,1.3]} position={[-2.2,.72,0]} radius={.09}><meshStandardMaterial color="#e5d8c3" roughness={.8}/></RoundedBox>
  <RoundedBox args={[.32,.22,1.3]} position={[-3.65,.64,0]} radius={.06}><meshStandardMaterial color="#eee2cf" roughness={.8}/></RoundedBox>
  <Tube points={[[-.9,1.6,-.45],[-1.1,2.12,-.45],[-.75,2.25,-.45],[.2,2.25,-.45]]} r={.04}/>
  <Tube points={[[-.9,1.6,.45],[-1.1,2.12,.45],[-.75,2.25,.45],[.2,2.25,.45]]} r={.04}/>
  <mesh position={[-.7,2.27,0]}><boxGeometry args={[.75,.065,1.05]}/><meshStandardMaterial color="#e6e2d7" roughness={.25}/></mesh>
  <mesh position={[-.75,2.4,0]}><cylinderGeometry args={[.2,.23,.18,24]}/><meshStandardMaterial color="#e9e5db"/></mesh>
  <Tube points={[[-.4,2.3,0],[-.55,2.95,0]]} r={.013}/>
  <mesh position={[-4.02,.1,0]} rotation={[0,0,.15]}><boxGeometry args={[.18,.6,.42]}/><meshStandardMaterial color="#252c35" metalness={.6} roughness={.2}/></mesh>
 </group>
}
function Parachute(){
 const panels=useMemo(()=>Array.from({length:16},(_,k)=>{const v:number[]=[],ix:number[]=[];const n=18,m=5;for(let i=0;i<=n;i++){const t=i/n*Math.PI*.48;for(let j=0;j<=m;j++){const a=(k+j/m)/16*Math.PI*2;const r=Math.sin(t)*1.8;const puff=1+.025*Math.sin(j/m*Math.PI);v.push(Math.cos(a)*r*puff,Math.cos(t)*.85,Math.sin(a)*r*puff)}}for(let i=0;i<n;i++)for(let j=0;j<m;j++){const a=i*(m+1)+j,b=a+m+1;ix.push(a,b,a+1,b,b+1,a+1)}const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(v,3));g.setIndex(ix);g.computeVertexNormals();return g}),[]);
 return <group>{panels.map((g,i)=><mesh key={i} geometry={g}><meshPhysicalMaterial color={i%4===0?CORAL:i%4===1?"#e4dfd1":i%4===2?"#487886":"#173b50"} roughness={.48} side={T.DoubleSide} sheen={.7}/></mesh>)}
 {Array.from({length:16},(_,i)=>{const a=i/16*Math.PI*2;return <Tube key={i} points={[[Math.cos(a)*1.797,.054,Math.sin(a)*1.797],[Math.cos(a)*.65,-1.4,Math.sin(a)*.65],[0,-2.7,0]]} r={.009} color="#ded6c8"/>})}
 <mesh position={[0,-2.8,0]}><sphereGeometry args={[.105,12,12]}/><meshStandardMaterial color="#dbc3a7"/></mesh>
 <mesh position={[0,-3.04,0]} rotation={[0,0,.12]}><capsuleGeometry args={[.1,.26,4,12]}/><meshStandardMaterial color={CORAL}/></mesh>
 <Tube points={[[0,-3.18,0],[.15,-3.45,.06],[.4,-3.45,.06]]} r={.045} color="#152a3a"/>
 <Tube points={[[0,-3.18,0],[-.05,-3.43,-.07],[.2,-3.45,-.07]]} r={.045} color="#152a3a"/>
 </group>
}
const waterVertex=`varying vec3 vWorld; varying vec3 vNormalW; uniform float uTime; void main(){vec3 p=position;float t=uTime;float a=p.x*.48+t*.62;float b=p.y*.7-t*.42;p.z+=sin(a)*.07+sin(b)*.04;vNormalW=normalize(vec3(-cos(a)*.034,-cos(b)*.028,1.));vec4 w=modelMatrix*vec4(p,1.);vWorld=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
const waterFragment=`varying vec3 vWorld;varying vec3 vNormalW;uniform float uTime;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float swell(vec2 q){return sin(q.x*.7+q.y*.31+uTime*.8)*.17+sin(q.x*1.8-q.y*.76-uTime*.6)*.055+noise(q*3.+uTime*.12)*.075;}
void main(){vec2 q=vWorld.xz;float eps=.055;float dx=(swell(q+vec2(eps,0.))-swell(q-vec2(eps,0.)))/(2.*eps);float dz=(swell(q+vec2(0.,eps))-swell(q-vec2(0.,eps)))/(2.*eps);vec3 n=normalize(vec3(-dx,1.,-dz));vec3 eye=normalize(cameraPosition-vWorld);vec3 sun=normalize(vec3(-.3,.8,.5));float spec=pow(max(0.,dot(n,normalize(eye+sun))),95.);float fres=pow(1.-max(0.,dot(n,eye)),3.);vec3 col=mix(vec3(.017,.065,.092),vec3(.07,.19,.24),fres);col+=vec3(.39,.57,.61)*spec*.48;col+=vec3(.015,.033,.039)*(swell(q)+.3);float trail=(1.-smoothstep(.1,1.1,abs(q.y)))*smoothstep(-17.,-5.,q.x)*(1.-smoothstep(-4.4,-3.,q.x));col+=vec3(.13,.24,.27)*trail*noise(vec2(q.x*2.+uTime*2.,q.y*8.))*.45;float alpha=1.-smoothstep(14.,25.,length(q));gl_FragColor=vec4(col,alpha);}`;
function World({drive,onReady}:{drive:React.MutableRefObject<MarineDrive>;onReady:()=>void}){
 const yacht=useRef<T.Group>(null),chute=useRef<T.Group>(null),all=useRef<T.Group>(null);const look=useRef(new T.Vector3());
 const water=useMemo(()=>new T.ShaderMaterial({vertexShader:waterVertex,fragmentShader:waterFragment,uniforms:{uTime:{value:0}},transparent:true,depthWrite:false}),[]);
 useEffect(()=>{onReady()},[onReady]);
 useFrame((st,dt)=>{const d=drive.current;const t=d.reduced?0:st.clock.elapsedTime;const p=d.p;const orbit=d.drag+(d.reduced?0:d.x*.14);const k=Math.min(1,dt*4);
 const phase=Math.max(0,Math.min(1,(p-.3)/.5));const angle=.72+orbit+p*.85;const mobile=st.size.width<760;const distance=(mobile?23:15)-phase*(mobile?5:3);
 const target=new T.Vector3(Math.cos(angle)*distance,7+phase*5+(!d.reduced?d.y*.5:0),Math.sin(angle)*distance);
 st.camera.position.lerp(target,k);look.current.lerp(new T.Vector3(-.8-phase*2.3,(mobile?2.8:2.4)+phase*2.8,0),k);st.camera.lookAt(look.current);
 if(yacht.current){yacht.current.rotation.z=Math.sin(t*.75)*.012;yacht.current.rotation.x=Math.sin(t*.65)*.015;yacht.current.position.y=Math.sin(t*.85)*.03;}
 if(chute.current){chute.current.rotation.z=-.16+Math.sin(t*.5)*.025;chute.current.rotation.x=Math.sin(t*.4)*.035;}
 if(all.current)all.current.position.x=0;water.uniforms.uTime.value=t;
 });
 return <group ref={all}>
  <ambientLight intensity={.8}/><directionalLight position={[5,12,7]} intensity={3} color="#ffead4"/><directionalLight position={[-8,4,-6]} intensity={2.5} color="#7aafc9"/>
  <Environment resolution={128} frames={1}><Lightformer intensity={3} color="#f1ede5" scale={[12,6,1]} position={[0,8,0]} rotation={[-Math.PI/2,0,0]}/><Lightformer intensity={2} color="#89b5cc" scale={[15,4,1]} position={[0,3,-8]}/></Environment>
  <group ref={yacht}><Yacht/></group>
  <group position={[-4.4,6.2,-.4]} rotation={[.08,0,-.16]} ref={chute}><Parachute/></group>
  <Tube points={[[-3.65,.7,0],[-4.4,1.8,-.15],[-4.65,3.15,-.4]]} r={.012} color="#c2b7a5"/>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.33,0]} material={water}><planeGeometry args={[60,60,160,160]}/></mesh>
 </group>
}
function MarineScene({drive,onReady,active=true}:{drive:React.MutableRefObject<MarineDrive>;onReady:()=>void;active?:boolean}){return <Canvas frameloop={active?"always":"never"} dpr={[1,1.5]} camera={{position:[10,7,11],fov:42,near:.1,far:100}} gl={{alpha:true,antialias:true,powerPreference:"high-performance"}}><World drive={drive} onReady={onReady}/></Canvas>}

export default memo(MarineScene);
