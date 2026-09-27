import React,{useCallback,useEffect,useRef,useState} from 'react';
import {Volume2,VolumeX,Library,Drama} from 'lucide-react';
import {siPython,siOpenjdk,siC,siDotnet,siTypescript,siJavascript,siReact,siNodedotjs,siExpress,siFastapi,siTensorflow,siOnnx,siMediapipe,siPostgresql,siMysql,siMongodb,siFirebase,siSupabase,siPytest,siGit,siGithub,siDocker,siGitlab,siRender,siGooglemaps} from 'simple-icons';
import {keyClick,tone,toggleSound,useSoundEnabled} from './sound';
import './toolkit.css';

// LED colour per group, used by the dot-matrix display.
const groups={Languages:'#ff4fa3',Frontend:'#46d7ff',Backend:'#ffb13b','AI / ML':'#a56bff',Data:'#4dff9a',Testing:'#ffe14d',Tools:'#ff6a4d'};
const k=(label,letter,icon,group,w=1.25)=>({label,letter,icon,group,w});
const m=(label,w=1,tone='dark')=>({mod:label,w,tone});
const fill=(label,tone='dark')=>({mod:label,fill:true,tone});
const rows=[
 [m('Esc'),k('Python','p',siPython,'Languages'),k('Java','j',siOpenjdk,'Languages'),k('C','c',siC,'Languages',1),k('C#','3',siDotnet,'Languages',1),k('TypeScript','t',siTypescript,'Languages',1.5),k('JavaScript','s',siJavascript,'Languages',1.5),m('-',1,'light'),m('=',1,'light'),fill('Backspace'),m('Delete')],
 [m('Tab',1.5,'light'),k('React','r',siReact,'Frontend'),k('Node.js','n',siNodedotjs,'Backend'),k('Express','x',siExpress,'Backend'),k('FastAPI','f',siFastapi,'Backend'),k('TensorFlow','w',siTensorflow,'AI / ML',1.5),k('ONNX','o',siOnnx,'AI / ML'),k('MediaPipe','m',siMediapipe,'AI / ML',1.5),k('RAG','a',Library,'AI / ML',1),fill('\\','light')],
 [m('Caps',1.75,'light'),k('PostgreSQL','q',siPostgresql,'Data',1.5),k('MySQL','y',siMysql,'Data'),k('MongoDB','d',siMongodb,'Data',1.5),k('Firebase','b',siFirebase,'Data'),k('Supabase','u',siSupabase,'Data',1.5),k('Pytest','z',siPytest,'Testing'),k('Playwright','1',Drama,'Testing',1.5),fill('Enter')],
 [m('Shift',2.25,'light'),k('Git','g',siGit,'Tools',1),k('GitHub','h',siGithub,'Tools'),k('Docker','k',siDocker,'Tools'),k('GitLab CI','l',siGitlab,'Tools'),k('Render','e',siRender,'Tools'),k('Maps API','2',siGooglemaps,'Tools',1.5),fill('Shift','light'),m('▲',1,'blue')],
 [m('Ctrl',1.25,'light'),m('Super',1.25,'light'),m('Alt',1.25,'light'),{space:true,fill:true,tone:'dark'},m('Alt',1.25,'light'),m('Fn',1.25,'light'),m('◀',1,'green'),m('▼',1,'yellow'),m('▶',1,'red')]
];
rows.forEach(r=>{const used=r.reduce((s,key)=>s+(key.fill?0:key.w),0);r.forEach(key=>{if(key.fill)key.w=15-used})});
const skills=rows.flat().filter(key=>key.label);
const byLetter=Object.fromEntries(skills.map(s=>[s.letter,s]));

// Classic 5x7 dot font, one byte per column (bit 0 = top row).
const FONT={' ':[0,0,0,0,0],'#':[0x14,0x7f,0x14,0x7f,0x14],'+':[8,8,0x3e,8,8],'-':[8,8,8,8,8],'.':[0,0x60,0x60,0,0],'/':[0x20,0x10,8,4,2],'·':[0,0,8,0,0],
 0:[0x3e,0x51,0x49,0x45,0x3e],1:[0,0x42,0x7f,0x40,0],2:[0x42,0x61,0x51,0x49,0x46],3:[0x21,0x41,0x45,0x4b,0x31],4:[0x18,0x14,0x12,0x7f,0x10],5:[0x27,0x45,0x45,0x45,0x39],6:[0x3c,0x4a,0x49,0x49,0x30],7:[1,0x71,9,5,3],8:[0x36,0x49,0x49,0x49,0x36],9:[6,0x49,0x49,0x29,0x1e],
 A:[0x7e,0x11,0x11,0x11,0x7e],B:[0x7f,0x49,0x49,0x49,0x36],C:[0x3e,0x41,0x41,0x41,0x22],D:[0x7f,0x41,0x41,0x22,0x1c],E:[0x7f,0x49,0x49,0x49,0x41],F:[0x7f,9,9,9,1],G:[0x3e,0x41,0x49,0x49,0x7a],H:[0x7f,8,8,8,0x7f],I:[0,0x41,0x7f,0x41,0],J:[0x20,0x40,0x41,0x3f,1],K:[0x7f,8,0x14,0x22,0x41],L:[0x7f,0x40,0x40,0x40,0x40],M:[0x7f,2,0xc,2,0x7f],N:[0x7f,4,8,0x10,0x7f],O:[0x3e,0x41,0x41,0x41,0x3e],P:[0x7f,9,9,9,6],Q:[0x3e,0x41,0x51,0x21,0x5e],R:[0x7f,9,0x19,0x29,0x46],S:[0x46,0x49,0x49,0x49,0x31],T:[1,1,0x7f,1,1],U:[0x3f,0x40,0x40,0x40,0x3f],V:[0x1f,0x20,0x40,0x20,0x1f],W:[0x3f,0x40,0x38,0x40,0x3f],X:[0x63,0x14,8,0x14,0x63],Y:[7,8,0x70,8,7],Z:[0x61,0x51,0x49,0x45,0x43]};
const toColumns=text=>Array.from(text.toUpperCase()).flatMap(ch=>[...(FONT[ch]||FONT[' ']),0]);
const IDLE=['#ff4fa3','#ffb13b','#ffe14d','#4dff9a','#46d7ff','#4f7bff','#a56bff','#ff6a4d'];

function useLedDisplay(canvas,still){
 const message=useRef(null),visible=useRef(false);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;const ctx=el.getContext('2d');let raf=0,cols=0,w=0,h=0;const ROWS=9;
  const resize=()=>{const r=el.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;el.width=w*dpr;el.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);cols=Math.floor(w/(h/ROWS))};
  const draw=now=>{
   const pitch=h/ROWS,ox=(w-cols*pitch)/2,rad=pitch*.32,t=now/1000,lit=new Map(),msg=message.current;
   if(msg){const elapsed=(now-msg.start)/1000,pos=still?Math.max(0,Math.floor((cols-msg.columns.length)/2)):Math.round(cols-elapsed*26);
    msg.columns.forEach((bits,i)=>{const c=pos+i;if(c<0||c>=cols)return;for(let row=0;row<7;row++)if(bits>>row&1)lit.set(c+','+(row+1),msg.color)});
    if(!still&&pos+msg.columns.length<0)message.current=null}
   else for(let c=0;c<cols;c++){const band=Math.floor(c/7),x=c%7;if(x===6)continue;const base=Math.max(0,Math.sin(t*1.6+band*1.7)*.5+.5),peak=Math.round((2+base*(ROWS-3))*(1-Math.abs(x-2.5)/4.2));for(let row=0;row<peak;row++)lit.set(c+','+(ROWS-1-row),IDLE[band%IDLE.length])}
   ctx.clearRect(0,0,w,h);
   for(let c=0;c<cols;c++)for(let row=0;row<ROWS;row++){const color=lit.get(c+','+row);ctx.beginPath();ctx.arc(ox+c*pitch+pitch/2,row*pitch+pitch/2,rad,0,Math.PI*2);ctx.fillStyle=color||'#2b2230';if(color){ctx.shadowColor=color;ctx.shadowBlur=6}else ctx.shadowBlur=0;ctx.fill()}
   ctx.shadowBlur=0;
   if(visible.current&&!still)raf=requestAnimationFrame(draw)};
  const kick=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(draw)};
  const ob=new IntersectionObserver(([e])=>{visible.current=e.isIntersecting;if(e.isIntersecting)kick()});ob.observe(el);
  const ro=new ResizeObserver(()=>{resize();kick()});ro.observe(el);
  el.kick=kick;
  return()=>{cancelAnimationFrame(raf);ob.disconnect();ro.disconnect()};
 },[canvas,still]);
 return useCallback((text,color)=>{message.current=text?{columns:toColumns(text),color,start:performance.now()}:null;canvas.current?.kick?.()},[canvas]);
}

export default function Toolkit({extra}){
 const [pressed,setPressed]=useState(null),[announce,setAnnounce]=useState(''),[still,setStill]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const sound=useSoundEnabled(),canvas=useRef(null),section=useRef(null),inView=useRef(false),current=useRef(-1),flashTimer=useRef(0);
 const show=useLedDisplay(canvas,still);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setStill(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);

 const flash=id=>{setPressed(id);clearTimeout(flashTimer.current);flashTimer.current=setTimeout(()=>setPressed(null),140)};
 const press=useCallback((skill,row=2)=>{
  current.current=skills.indexOf(skill);flash(skill.label);keyClick(1+row*.06);
  tone([392,440,523.25,587.33,659.25,783.99][current.current%6],.5,.018,'triangle');
  show(`${skill.label} · ${skill.group}`,groups[skill.group]);setAnnounce(`${skill.label} — ${skill.group}`);
 },[show]);
 const pressMod=(key)=>{flash(key.space?'space':key.mod);keyClick(.8);
  if(key.space||key.mod==='Esc'||key.mod==='Delete'||key.mod==='Backspace'){show(null);setAnnounce('Display cleared');return}
  const step={'◀':-1,'▲':-1,'▶':1,'▼':1}[key.mod];if(step){const next=skills[(current.current+step+skills.length)%skills.length];press(next)}};

 useEffect(()=>{const el=section.current;const ob=new IntersectionObserver(([e])=>{inView.current=e.intersectionRatio>.35},{threshold:[0,.35,.6]});ob.observe(el);
  const down=e=>{if(!inView.current||e.metaKey||e.ctrlKey||e.altKey||e.repeat)return;const tag=document.activeElement?.tagName;if(tag==='INPUT'||tag==='TEXTAREA'||document.querySelector('dialog[open]'))return;
   if(e.key===' '){e.preventDefault();pressMod({space:true});return}
   const arrow={ArrowLeft:'◀',ArrowRight:'▶'}[e.key];if(arrow){e.preventDefault();pressMod({mod:arrow});return}
   const key=e.key==='#'?'3':e.key.toLowerCase(),skill=byLetter[key];if(skill)press(skill,rows.findIndex(r=>r.includes(skill)))};
  window.addEventListener('keydown',down);return()=>{ob.disconnect();window.removeEventListener('keydown',down)}},[press]);

 return <section id="toolkit" className="toolkit-kb" ref={section}>
  <div className="kb-heading"><span className="kb-eyebrow mono">05 — Toolkit</span><h2 className="kb-title">What I<br/>work with</h2></div>
  <div className="kb">
   <div className="kb-bezel"><canvas ref={canvas} className="kb-led" aria-hidden="true"/><span className="sr-only" aria-live="polite">{announce}</span></div>
   <div className="kb-plate">{rows.map((row,r)=><div className="kb-row" key={r}>{row.map((key,i)=>key.label
    ?<button type="button" key={key.label} className={'kb-key'+(pressed===key.label?' is-down':'')} style={{'--w':key.w,'--glow':groups[key.group]}} aria-label={`${key.label} — ${key.group}`} onClick={()=>press(key,r)}><span className="kb-cap">{key.icon.path?<svg className="kb-logo" viewBox="0 0 24 24" aria-hidden="true"><path d={key.icon.path}/></svg>:<key.icon className="kb-logo kb-lucide" aria-hidden="true"/>}<span className="kb-legend">{key.label}</span><span className="kb-sub" aria-hidden="true">{key.letter}</span></span></button>
    :<button type="button" key={i} tabIndex={key.space||/[◀▶▲▼]/.test(key.mod)?0:-1} aria-label={key.space?'Space — clear display':{'◀':'Previous tool','▶':'Next tool','▲':'Previous tool','▼':'Next tool'}[key.mod]} aria-hidden={key.space||/[◀▶▲▼]/.test(key.mod)?undefined:true} className={`kb-key kb-mod kb-${key.tone}`+(pressed===(key.space?'space':key.mod)?' is-down':'')} style={{'--w':key.w}} onClick={()=>pressMod(key)}><span className="kb-cap"><span className="kb-legend">{key.space?'':key.mod}</span></span></button>)}</div>)}</div>
  </div>
  <div className="kb-foot"><p className="mono">Click a cap, or type its corner letter. Space clears the display.</p><button type="button" className={'kb-sound'+(sound?' is-on':'')} onClick={()=>toggleSound().catch(()=>{})} aria-pressed={sound}>{sound?<Volume2 size={16}/>:<VolumeX size={16}/>} <span className="mono">{sound?'Sound on':'Sound off'}</span></button></div>
  {extra&&<p className="kb-extra">{extra}</p>}
 </section>
}
