import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ArrowRight,ChevronRight,ChevronLeft,Copy,Check,X,Award,Users,MapPin} from 'lucide-react';
import {stories,milestones} from './stories';
import './stories.css';

const visibleStories=stories.filter(s=>s.published).sort((a,b)=>b.date.localeCompare(a.date));
const month=date=>new Intl.DateTimeFormat('en',{month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(date+'-01T12:00:00Z'));
// Stories first (newest first), then the undated milestones in the order listed in stories.js.
const reel=[...visibleStories.map(s=>({...s,kind:'story'})),...milestones.map(m=>({...m,kind:'milestone'}))];

const TONES=['lilac','cream','orange'];
// Each card rests in the centre for part of the scroll, then rolls smoothly to the next.
// Smoothing: the reel glides toward the scroll position instead of jumping with every scroll event.
const FOLLOW=.18;
// Responsive sources: the 800px copy for small slots, the full photo for large/retina ones.
const srcSet=img=>img.thumb?`${img.thumb} 800w, ${img.src} ${img.w||1600}w`:undefined;
// Every card shares one landscape shape: text on the left, a dark panel (photo or art + stats) on the right.
function StoryCard({item,index,onOpen}){
 const story=item.kind==='story',image=item.images?.[0];
 const stats=story?item.stats:[item.stat];
 const Tag=story?'button':'div';
 const props=story?{onClick:()=>onOpen(item.id),'aria-label':`Read story: ${item.title}`}:{};
 return <Tag className={'reel-card reel-feature reel-'+TONES[index%TONES.length]} {...props}>
  <div className="reel-left"><div><h3 className="reel-display">{item.label}</h3><span className="reel-meta">{story?`${item.category} · ${month(item.date)}`:item.title}</span><p className="reel-quote">“{item.excerpt}”</p></div>{story?<span className="reel-link">Read the story <ChevronRight size={17}/></span>:<span className="reel-meta reel-milestone-tag">{item.id==='gdg-gitam'?<Users size={16}/>:<Award size={16}/>} Milestone</span>}</div>
  <div className={'reel-panel'+(image?' has-image':'')+(!image&&!stats?.length?' is-empty':'')}>
   {image?<img src={image.thumb||image.src} srcSet={srcSet(image)} sizes="(max-width: 760px) 86vw, 380px" width={image.w} height={image.h} alt="" loading="lazy" decoding="async"/>:<div className="reel-art" aria-hidden="true"><svg viewBox="0 0 200 160"><path d="M20 130 C60 130 50 60 100 70 S150 30 180 25" /><circle cx="20" cy="130" r="6"/><circle cx="180" cy="25" r="6"/></svg></div>}
   <div className="reel-stats">{stats?.map(([n,l])=><div key={l}><strong>{n}</strong><span>{l}</span></div>)}</div>
  </div>
 </Tag>;
}

// Full-size photo in its own modal layer, framed to the photo's real proportions,
// with a close (back) button on the photo's top-right corner.
function PhotoViewer({images,index,onChange,onClose}){
 const ref=useRef(null),img=images[index],n=images.length;
 useEffect(()=>{const d=ref.current;d.showModal();return()=>{if(d.open)d.close()}},[]);
 const go=step=>onChange((index+step+n)%n);
 return <dialog ref={ref} className="photo-viewer" aria-label={`Photo ${index+1} of ${n}`} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===ref.current||e.target.classList.contains('photo-stage'))onClose()}} onKeyDown={e=>{if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)}}>
  <div className="photo-stage">
   <figure className="photo-frame" key={index} style={img.w?{aspectRatio:`${img.w} / ${img.h}`,'--w':img.w,'--h':img.h}:undefined}>
    <img src={img.src} width={img.w} height={img.h} alt={img.alt} decoding="async"/>
    <button className="viewer-btn viewer-close" aria-label="Close photo and go back" onClick={onClose} autoFocus><X/></button>
   </figure>
   <p className="photo-caption">{img.alt} <span>{index+1} / {n}</span></p>
  </div>
  {n>1&&<><button className="viewer-btn viewer-prev" aria-label="Previous photo" onClick={()=>go(-1)}><ChevronLeft/></button><button className="viewer-btn viewer-next" aria-label="Next photo" onClick={()=>go(1)}><ChevronRight/></button></>}
 </dialog>;
}

export default function Stories(){
 const [openId,setOpenId]=useState(null),[viewer,setViewer]=useState(null),[copied,setCopied]=useState(false),[still,setStill]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const track=useRef(null),cards=useRef([]),dialog=useRef(null);
 const story=visibleStories.find(s=>s.id===openId);

 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setStill(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);

 // Scroll-driven reel: cards sit on a horizontal line that rolls over an invisible cylinder.
 useLayoutEffect(()=>{
  const el=track.current;if(!el)return;
  if(still){cards.current.forEach(c=>{if(c){c.style.transform='';c.style.zIndex=''}});el.style.height='';return}
  let raf=0,centers=[],vw=0,vh=0,range=1,current=null,target=0;const z=[];
  // Measure once (and on width changes only), so the phone address bar showing/hiding can't make the reel jump.
  const measure=()=>{vw=window.innerWidth;vh=window.innerHeight;const gap=Math.min(vw*.16,220);let x=0;centers=cards.current.map((c,i)=>{const w=c.offsetWidth;if(i)x+=w/2;const at=x;x+=w/2+gap;return at});el.style.height=`${vh+(cards.current.length-1)*vh*.75}px`;range=el.offsetHeight-vh};
  const readTarget=()=>{const p=Math.min(1,Math.max(0,-el.getBoundingClientRect().top/range));target=p*centers[centers.length-1]};
  const draw=shift=>{const k=Math.max(vw*.83,420),R=vh*.625;
   cards.current.forEach((c,i)=>{const x=shift-centers[i],theta=50*Math.tanh(x/k),rad=theta*Math.PI/180;
    c.style.transform=`translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${(-R*Math.sin(rad)).toFixed(1)}px,${(-R*(1-Math.cos(rad))).toFixed(1)}px) rotateX(${theta.toFixed(2)}deg)`;
    const zi=100-Math.round(Math.abs(x)/50);if(z[i]!==zi){z[i]=zi;c.style.zIndex=String(zi)}})};
  const frame=()=>{const diff=target-current;current=Math.abs(diff)<.3?target:current+diff*FOLLOW;draw(current);raf=current===target?0:requestAnimationFrame(frame)};
  const schedule=()=>{readTarget();if(!raf)raf=requestAnimationFrame(frame)};
  let lastW=window.innerWidth;
  const resize=()=>{if(window.innerWidth===lastW&&matchMedia('(pointer: coarse)').matches)return;lastW=window.innerWidth;measure();readTarget();current=target;draw(current)};
  measure();readTarget();current=target;draw(current);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',resize);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',resize)};
 },[still]);

 // Deep links (#story-id) open that story.
 useEffect(()=>{const sync=()=>{const id=window.location.hash.slice(1);const s=visibleStories.find(s=>'story-'+s.id===id);if(s){setOpenId(s.id);document.getElementById('stories')?.scrollIntoView({behavior:'instant'})}};sync();window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync)},[]);
 useEffect(()=>{const d=dialog.current;if(!d)return;if(openId&&!d.open){d.showModal();document.body.style.overflow='hidden'}else if(!openId&&d.open)d.close();if(!openId)document.body.style.overflow='';setCopied(false)},[openId]);

 async function share(){const url=new URL(window.location.href);url.hash='story-'+openId;try{await navigator.clipboard.writeText(url.href);setCopied(true);setTimeout(()=>setCopied(false),2000)}catch{window.location.hash=url.hash}}

 return <section id="stories" className={'stories-section'+(still?' reel-still':'')}>
  <div className="stories-head"><span className="stories-tag">06 / Stories · a life in progress</span><h2 className="stories-title">Chapters so far,<br/><em>told as they happen.</em></h2><p className="stories-intro">Things I’m building, chapters I’m starting, and little updates along the way.</p></div>
  {reel.length?<div className="reel-track" ref={track}><div className="reel-stage">{reel.map((item,i)=><div className="reel-slot" id={item.kind==='story'?'story-'+item.id:undefined} key={item.id} ref={el=>cards.current[i]=el}><StoryCard item={item} index={i} onOpen={setOpenId}/></div>)}</div></div>:<p className="stories-intro">A new chapter is on its way. Check back soon.</p>}
  <div className="stories-note"><span className="journal-dot"/> THE STORY IS STILL BEING WRITTEN <ArrowRight size={15}/></div>
  <dialog ref={dialog} className="story-dialog" aria-labelledby="story-dialog-title" onClose={()=>{setViewer(null);setOpenId(null)}} onClick={e=>{if(e.target===dialog.current)setOpenId(null)}}>{story&&<>
   <button className="dialog-close icon-button" aria-label="Close story" onClick={()=>setOpenId(null)}><X/></button>
   {story.images?.[0]&&<div className="story-cover"><img src={story.images[0].thumb||story.images[0].src} srcSet={srcSet(story.images[0])} sizes="(max-width: 760px) 92vw, 700px" width={story.images[0].w} height={story.images[0].h} alt={story.images[0].alt||''} decoding="async"/></div>}
   <span className="reel-meta">{story.category} · {month(story.date)}</span>
   <h2 id="story-dialog-title" className="reel-serif">{story.title}</h2>
   {story.location&&<p className="story-location"><MapPin size={15}/> {story.location}</p>}
   {story.stats?.length>0&&<div className="story-stats">{story.stats.map(([n,l])=><div key={l}><strong>{n}</strong><span>{l}</span></div>)}</div>}
   {story.body.map((p,n)=><p key={n}>{p}</p>)}
   {story.images?.length>1&&<><h3 className="story-skills-title">Photos · {story.images.length}</h3><div className="story-photos">{story.images.map((img,n)=><button key={img.src} className="story-photo" style={img.w?{aspectRatio:`${img.w} / ${img.h}`}:undefined} onClick={()=>setViewer(n)} aria-label={`Open photo ${n+1} of ${story.images.length}: ${img.alt}`}><img src={img.thumb||img.src} srcSet={srcSet(img)} sizes="(max-width: 760px) 46vw, 345px" width={img.w} height={img.h} alt="" loading="lazy" decoding="async"/></button>)}</div></>}
   {story.skills?.length>0&&<><h3 className="story-skills-title">Skills & keywords</h3><div className="tags story-skills">{story.skills.map(t=><span key={t}>{t}</span>)}</div></>}
   <button className="text-link" onClick={share}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Link copied':'Copy story link'}</button><span role="status" className="sr-only">{copied?'Story link copied':''}</span>
   {viewer!==null&&story.images?.[viewer]&&<PhotoViewer images={story.images} index={viewer} onChange={setViewer} onClose={()=>setViewer(null)}/>}
  </>}</dialog>
 </section>
}
