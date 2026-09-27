import React,{useCallback,useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ArrowRight,MapPin,Plus,Minus} from 'lucide-react';
import {experience as newestFirst} from './data';
// Oldest first, so the route ends at the latest internship.
const experience=[...newestFirst].reverse();
const LATEST=experience.length-1;
import {tone} from './sound';
import './journey.css';

const NOTES=[523.25,587.33,659.25,783.99,880];
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Builds an S-shaped path: in at the left margin, down through each checkpoint (alternating
// sides), and out at the right margin. Corners are rounded so it reads as one flowing curve.
function buildPath(points,width,endY,mobile){
 if(mobile){const x=points[0].x;let d=`M${x} 0`;points.forEach((p,i)=>{if(i)d+=` C${x+26} ${(points[i-1].y+p.y)/2-40} ${x-26} ${(points[i-1].y+p.y)/2+40} ${x} ${p.y}`;else d+=` L${x} ${p.y}`});return d+` L${x} ${endY}`}
 const r=Math.min(140,width*.1);const first=points[0];
 let d=`M0 ${first.y-r} C${first.x*.6} ${first.y-r} ${first.x} ${first.y-r*.6} ${first.x} ${first.y}`;
 points.forEach((p,i)=>{
  const next=points[i+1],turnY=p.turn;
  const toX=next?next.x:width,dir=Math.sign(toX-p.x)||1;
  d+=` L${p.x} ${turnY-r} C${p.x} ${turnY-r*.45} ${p.x+dir*r*.45} ${turnY} ${p.x+dir*r} ${turnY}`;
  if(next)d+=` L${next.x-dir*r} ${turnY} C${next.x-dir*r*.45} ${turnY} ${next.x} ${turnY+r*.45} ${next.x} ${turnY+r} L${next.x} ${next.y}`;
  else d+=` L${width} ${turnY}`;
 });
 return d;
}

// The arrow is tied to the scroll position: it sits level with a fixed line on screen and
// moves exactly as far and as fast as the page scrolls (only a light smoothing).
const FOLLOW=.35;

export default function Journey(){
 const wrap=useRef(null),cards=useRef([]),path=useRef(null),trail=useRef(null),arrow=useRef(null),table=useRef(null),current=useRef(0);
 const [geo,setGeo]=useState(null),[shown,setShown]=useState(()=>reduced()?experience.length:0),[open,setOpen]=useState(null),[still]=useState(reduced),shownRef=useRef(shown),[ends,setEnds]=useState(null),[arrived,setArrived]=useState(false),arrivedRef=useRef(false);

 // Measure the cards and lay the path around them.
 const measure=useCallback(()=>{
  const el=wrap.current;if(!el)return;const W=el.clientWidth,mobile=W<760,box=el.getBoundingClientRect();
  const points=cards.current.map((c,i)=>{const r=c.getBoundingClientRect(),top=r.top-box.top,left=i%2===0;
   return {x:mobile?22:left?W*.04:W*.96,y:top+34,turn:top+r.height+(mobile?40:70)}});
  const endY=el.scrollHeight;
  setGeo({W,H:endY,mobile,d:buildPath(points,W,endY,mobile)});
 },[]);
 useLayoutEffect(()=>{measure();const ro=new ResizeObserver(measure);ro.observe(wrap.current);return()=>ro.disconnect()},[measure]);

 // Sample the path once so scroll position can be mapped to a point on it.
 useLayoutEffect(()=>{
  const p=path.current;if(!p||!geo)return;const L=p.getTotalLength(),step=4,samples=[];let v=0,prev=p.getPointAtLength(0);
  for(let l=0;l<=L;l+=step){const pt=p.getPointAtLength(l);v+=Math.abs(pt.y-prev.y)+Math.abs(pt.x-prev.x)*.14;samples.push({l,v,y:pt.y,x:pt.x});prev=pt}
  const box=wrap.current.getBoundingClientRect();
  const checkpoints=cards.current.map(c=>{const y=c.getBoundingClientRect().top-box.top+34;return samples.find(s=>s.y>=y-1)?.l??0});
  table.current={L,samples,checkpoints,vMax:v};
  const last=samples[samples.length-1];setEnds([{x:samples[0].x,y:samples[0].y},{x:last.x,y:last.y}]);
  trail.current.style.strokeDasharray=`${L} ${L}`;
  if(!current.current)current.current=checkpoints[0];
 },[geo]);

 // Scroll drives a target length along the path; the arrow eases toward it every frame.
 useEffect(()=>{
  if(!geo)return;let raf=0,target=0,running=false;
  const place=()=>{if(table.current){const done=current.current>=table.current.L-4;if(done!==arrivedRef.current){arrivedRef.current=done;setArrived(done)}}const t=table.current;if(!t)return;const p=path.current,l=current.current;
   const a=p.getPointAtLength(l),b=p.getPointAtLength(Math.min(t.L,l+2)),angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
   arrow.current.style.transform=`translate(${a.x}px,${a.y}px) translate(-50%,-50%)`;
   arrow.current.querySelector('svg').style.transform=`rotate(${angle}deg)`;
   trail.current.style.strokeDashoffset=String(t.L-l);
   const reached=t.checkpoints.filter(c=>l>=c-1).length,next=reached>1||l>t.checkpoints[0]+40?reached:0;
   if(next>shownRef.current){shownRef.current=next;tone(NOTES[(next-1)%NOTES.length],.9,.02);setShown(next)}};
  const compute=()=>{const t=table.current;if(!t)return;const box=wrap.current.getBoundingClientRect(),y=window.innerHeight*.55-box.top;
   const v=Math.max(0,Math.min(1,y/geo.H))*t.vMax;const s=t.samples.find(s=>s.v>=v)||t.samples[t.samples.length-1];
   target=Math.max(t.checkpoints[0],s.l)};
  const frame=()=>{const diff=target-current.current;current.current+=still?diff:diff*FOLLOW;place();
   if(Math.abs(diff)>.5)raf=requestAnimationFrame(frame);else running=false};
  const kick=()=>{compute();if(!running){running=true;raf=requestAnimationFrame(frame)}};
  kick();window.addEventListener('scroll',kick,{passive:true});window.addEventListener('resize',kick);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',kick);window.removeEventListener('resize',kick)};
 },[geo,still]);

 const reveal=()=>{if(!shownRef.current){shownRef.current=1;setShown(1)}setOpen(o=>o===0?null:0);tone(NOTES[0],.9,.02)};

 return <div className={'journey'+(geo?.mobile?' is-mobile':'')} ref={wrap}>
  {geo&&<svg className="journey-path" width={geo.W} height={geo.H} viewBox={`0 0 ${geo.W} ${geo.H}`} aria-hidden="true">
   <defs><mask id="journey-travelled" maskUnits="userSpaceOnUse"><path ref={trail} d={geo.d} className="journey-mask"/></mask></defs>
   <path ref={path} d={geo.d} className="journey-base"/>
   <path d={geo.d} className="journey-route" mask="url(#journey-travelled)"/>
   {ends&&<><circle cx={ends[0].x} cy={ends[0].y} r="10" className="journey-terminal is-reached"/><circle cx={ends[1].x} cy={ends[1].y} r="10" className={'journey-terminal'+(shown>=experience.length&&arrived?' is-reached':'')}/></>}
  </svg>}
  {geo&&<button ref={arrow} className={'journey-arrow'+(shown?'':' is-waiting')} onClick={reveal} aria-expanded={open===0} aria-controls="journey-card-0" aria-label={`Start the journey: ${experience[0].company}`}><ArrowRight size={24}/></button>}
  {experience.map((e,i)=><article key={e.company} id={'journey-card-'+i} ref={el=>cards.current[i]=el} className={'journey-card '+(i%2===0?'is-left':'is-right')+(i<shown?' is-shown':'')+(open===i?' is-open':'')} aria-hidden={i<shown?undefined:true}>
   <span className={'journey-dot'+(i<shown?' is-reached':'')} aria-hidden="true"/>
   <div className="journey-meta mono"><span>{String(i+1).padStart(2,'0')}{i===LATEST&&<b> · LATEST</b>}</span><span>{e.date}</span></div>
   <h3>{e.company}</h3>
   <p className="journey-role">{e.role}{e.location&&<span><MapPin size={13}/> {e.location}</span>}</p>
   <p className="journey-summary">{e.summary}</p>
   <div className="journey-details" hidden={open!==i}><ul>{e.points.map(p=><li key={p}>{p}</li>)}</ul><div className="tags">{e.tags.map(t=><span key={t}>{t}</span>)}</div></div>
   <button className="journey-toggle" onClick={()=>setOpen(o=>o===i?null:i)} aria-expanded={open===i} tabIndex={i<shown?0:-1}>{open===i?'Less':'Full details'} {open===i?<Minus size={15}/>:<Plus size={15}/>}</button>
  </article>)}
  {!shown&&<p className="journey-hint mono" aria-hidden="true">← Tap the arrow, then scroll</p>}
 </div>
}
