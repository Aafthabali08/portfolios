import React,{useEffect,useRef,useState,useCallback} from 'react';
import {ArrowDown,ArrowUpRight,Github,Linkedin,Sun,Moon,Volume2,VolumeX,Pause,Play} from 'lucide-react';
import {profile,experience,projects} from './data';
import {tone,toggleSound,useSoundEnabled} from './sound';
import './hero.css';

export const names = [
 {code:'en',label:'English',first:'AAFTHAB',last:'ALI SHAIK',greeting:'Hello',latin:true},
 {code:'te',label:'తెలుగు',first:'ఆఫ్తాబ్',last:'అలీ షేక్',greeting:'నమస్కారం',split:'word'},
 {code:'hi',label:'हिन्दी',first:'आफ़ताब',last:'अली शेख',greeting:'नमस्ते',split:'word'},
 {code:'ur',label:'اردو',first:'آفتاب',last:'علی شیخ',greeting:'سلام',dir:'rtl',split:'word'},
 {code:'ja',label:'日本語',first:'アフターブ',last:'アリ・シャイク',greeting:'こんにちは'},
 {code:'zh',label:'中文',first:'阿夫塔布',last:'阿里·谢赫',greeting:'你好'},
];
// Fonts for the non-Latin names are fetched off the critical path: when the page is idle,
// or immediately when that language is shown.
const SCRIPT_FONTS={te:'Noto+Sans+Telugu:wght@600;800',hi:'Noto+Sans+Devanagari:wght@600;800',ur:'Noto+Nastaliq+Urdu:wght@600',ja:'Noto+Sans+JP:wght@700',zh:'Noto+Sans+SC:wght@700'};
const loadedFonts=new Set();
function loadScriptFont(code){const family=SCRIPT_FONTS[code];if(!family||loadedFonts.has(code))return;loadedFonts.add(code);const l=document.createElement('link');l.rel='stylesheet';l.href=`https://fonts.googleapis.com/css2?family=${family}&display=swap`;document.head.appendChild(l)}

function useAmbientSound(stage){
 const enabled=useSoundEnabled(),[error,setError]=useState(''),lastNote=useRef(0),visible=useRef(true);
 useEffect(()=>{const el=stage.current;if(!el)return;const ob=new IntersectionObserver(([e])=>{visible.current=e.isIntersecting});ob.observe(el);return()=>ob.disconnect()},[stage]);
 useEffect(()=>{if(!enabled)return;let step=0;const notes=[130.81,164.81,196,261.63,196,164.81];const tick=()=>{if(!document.hidden&&visible.current){tone(notes[step++%notes.length],3,.022);tone(notes[(step+2)%notes.length]*2,2,.009)}};tick();const id=setInterval(tick,1800);return()=>clearInterval(id)},[enabled]);
 async function toggle(){setError('');try{await toggleSound()}catch{setError('Sound is unavailable in this browser.')}}
 const note=useCallback(index=>{if(performance.now()-lastNote.current>75){lastNote.current=performance.now();tone([261.63,293.66,329.63,392,440,523.25,587.33][index%7],.35,.04)}},[]);
 return {enabled,toggle,note,error};
}
const titleCase=t=>t.toLowerCase().replace(/(^|[\s—-])([a-z])/g,(m,sp,c)=>sp+c.toUpperCase());
// Interleave internships and projects into one continuous line, straight from data.js.
const FLOW=Array.from({length:Math.max(experience.length,projects.length)},(_,i)=>[
 experience[i]&&`${experience[i].role} at ${experience[i].company} · ${titleCase(experience[i].date)}`,
 projects[i]&&`${projects[i].name} — ${projects[i].description} ${projects[i].tags.join(', ')}`
]).flat().filter(Boolean).join('   ✦   ')+'   ✦   ';
const COLORS=['#4881d5','#6ba44a','#d16850','#a379bf','#c18a3f','#439e98','#b76c9b'],CHARMS=['✳','◇','○','✧','△','+','✳'];
// Each hoverable unit lifts, recolours and plays a note. Latin and CJK names split per
// character; Telugu, Hindi and Urdu split per word so conjuncts and joined letters stay intact.
function Letters({text,offset=0,note,split}){
 let n=offset;const units=split==='word'?text.split(/(\s+)/):Array.from(text);
 return units.map((unit,i)=>{if(!unit.trim()||/^[・·]$/.test(unit))return <span key={i}>{unit}</span>;const idx=n++;return <span className="name-letter" style={{'--index':idx,'--letter-color':COLORS[idx%7]}} key={i} onPointerEnter={()=>note(idx)}>{unit}<span className="letter-charm" aria-hidden="true">{CHARMS[idx%7]}</span></span>});
}
// Text that flows continuously along an SVG path, looping seamlessly.
function FlowText({path,text,speed,playing,className}){
 const ref=useRef(null);
 useEffect(()=>{const el=ref.current;if(!el)return;const unit=el.getComputedTextLength()/4;let offset=0,last=performance.now(),raf;
  const frame=now=>{offset=(offset+(now-last)/1000*speed)%unit;last=now;el.setAttribute('startOffset',(offset-unit).toFixed(1));raf=requestAnimationFrame(frame)};
  el.setAttribute('startOffset',(-unit*.6).toFixed(1));offset=unit*.4;
  if(playing)raf=requestAnimationFrame(frame);return()=>cancelAnimationFrame(raf)},[playing,speed,text]);
 return <text className={className} dominantBaseline="central"><textPath ref={ref} href={'#'+path}>{text.repeat(4)}</textPath></text>
}
// Desktop: a wide wave across the screen. Phone: a taller, tighter wave sized to a narrow screen.
const RIBBON={
 wide:{box:'0 0 1440 640',d:'M-120 130 C40 140 180 250 250 360 C300 440 420 440 440 350 C460 260 330 230 300 320 C270 420 420 520 620 500 C820 480 910 450 1070 450 C1230 450 1340 330 1560 270',speed:46},
 narrow:{box:'0 0 390 600',d:'M-40 95 C20 90 55 130 62 190 C70 260 122 272 128 222 C134 175 76 176 68 238 C58 318 120 372 200 368 C280 364 300 312 330 300 C360 288 390 300 440 290',speed:30}
};
function Ribbon({playing}){
 const [narrow,setNarrow]=useState(()=>window.matchMedia('(max-width: 760px)').matches);
 useEffect(()=>{const m=window.matchMedia('(max-width: 760px)'),on=()=>setNarrow(m.matches);m.addEventListener('change',on);return()=>m.removeEventListener('change',on)},[]);
 const r=narrow?RIBBON.narrow:RIBBON.wide;
 return <svg className={'tech-ribbon'+(narrow?' is-narrow':'')} viewBox={r.box} preserveAspectRatio="xMidYMid meet" aria-hidden="true" key={narrow?'n':'w'}>
  <defs><path id="ribbon-flow" d={r.d}/></defs>
  <FlowText path="ribbon-flow" text={FLOW} speed={r.speed} playing={playing} className="ribbon-raw"/>
 </svg>
}
export default function Hero({dark,setDark,time}){
 const [language,setLanguage]=useState(0),[playing,setPlaying]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches),[hovered,setHovered]=useState(false),[replay,setReplay]=useState(0);
 const stage=useRef(null),[onScreen,setOnScreen]=useState(true);
 useEffect(()=>{const ob=new IntersectionObserver(([e])=>setOnScreen(e.isIntersecting));ob.observe(stage.current);return()=>ob.disconnect()},[]);
 useEffect(()=>{loadScriptFont(names[language].code)},[language]);
 useEffect(()=>{const all=()=>Object.keys(SCRIPT_FONTS).forEach(loadScriptFont);const id=window.requestIdleCallback?requestIdleCallback(all,{timeout:3500}):setTimeout(all,2500);return()=>window.cancelIdleCallback?cancelIdleCallback(id):clearTimeout(id)},[]);const {enabled,toggle,note,error}=useAmbientSound(stage);const name=names[language];
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>{if(media.matches)setPlaying(false)};media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
 useEffect(()=>{if(!playing||hovered)return;const id=setInterval(()=>setLanguage(i=>(i+1)%names.length),4800);return()=>clearInterval(id)},[playing,hovered]);
 return <section ref={stage} id="home" className={'hero immersive-hero'+(!playing?' motion-paused':'')}>
  <div className="hero-toolbar"><a className="hello-link" href="#about"><span className="hello-hand">👋</span><span lang={name.code}>{name.greeting}<span className="hello-dot">!</span></span></a><div className="hero-socials"><button className={'sound-control '+(enabled?'sound-active':'')} onClick={toggle} aria-pressed={enabled} aria-label={enabled?'Turn sound off':'Turn sound on'} title="Original ambient tones and letter sounds">{enabled?<Volume2 size={20}/>:<VolumeX size={20}/>}<span>{enabled?'SOUND ON':'SOUND OFF'}</span></button><a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub profile"><Github size={21}/></a><a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><Linkedin size={21}/></a><button className="icon-button" aria-label={dark?'Switch to light theme':'Switch to dark theme'} onClick={()=>setDark(!dark)}>{dark?<Sun size={20}/>:<Moon size={20}/>}</button><span className="hero-clock"><strong>{time}</strong><span>IST<br/>INDIA</span></span></div></div>
  <div className="name-stage" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocus={()=>setHovered(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHovered(false)}}>
   <Ribbon playing={playing&&onScreen}/>
   <h1 className="sr-only">Aafthab Ali Shaik — Software Engineer</h1>
   <button className={'name-display language-'+name.code} lang={name.code} dir={name.dir||'ltr'} aria-label={`Replay name animation in ${name.label}`} onClick={()=>{setReplay(i=>i+1);note(language)}}>
    <span className="name-line name-primary" key={name.code+replay}><Letters text={name.first} note={note} split={name.split}/></span>
    <span className="name-line name-secondary" key={'last'+name.code+replay}><Letters text={name.last} offset={name.split==='word'?name.first.split(/\s+/).length:Array.from(name.first).length} note={note} split={name.split}/></span>
   </button>
   <span className="name-hint mono">HOVER THE LETTERS. STAY CURIOUS.</span>
  </div>
  <div className="language-controls" aria-label="Name languages">{names.map((n,i)=><button key={n.code} lang={n.code} aria-pressed={i===language} aria-label={`Show name in ${n.label}`} onClick={()=>{setLanguage(i);setPlaying(false);note(i)}}>{n.label}</button>)}<button className="motion-toggle" onClick={()=>setPlaying(v=>!v)} aria-label={playing?'Pause name rotation':'Resume name rotation'} title={playing?'Pause name rotation':'Resume name rotation'}>{playing?<Pause size={14}/>:<Play size={14}/>}</button></div>
  <p className="hero-description">Software engineer. Curious mind. <span>Always building.</span></p>
  <div className="immersive-foot"><span className="available"><i/> Open to internships</span><a href="#about" className="hero-scroll">SCROLL TO EXPLORE <ArrowDown size={16}/></a><a className="hero-resume" href={profile.resumeUrl} download>Résumé <ArrowUpRight size={16}/></a></div>
  {error&&<p className="sound-error" role="status">{error}</p>}
 </section>
}
