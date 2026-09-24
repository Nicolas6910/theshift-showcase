import B from './brand.js';
import {buildScene,render,TOTAL,MARKS} from './shots.js';
import {scheduleTrack} from './audio.js';

const app=document.getElementById('app');
function fit(){
  const s=Math.min(window.innerWidth/1920,(window.innerHeight-52)/1080);
  app.style.transform=`scale(${s})`;
  document.getElementById('fit').style.height=(window.innerHeight-52)+'px';
}
addEventListener('resize',fit); fit();

const IMGS=[...new Set([...document.querySelectorAll('*')].flatMap(()=>[]))];
async function preload(){
  const list=['logo.png','favicon.png','home_desktop.png','donna_desktop.png','mfa_desktop.png','produits_desktop.png',
   'home_hero.png','home_nav.png','home_results.png','home_services.png','home_cta.png','stats_band.png',
   'tab_Chatbot.png','tab_Email.png','tab_Veille.png','calc_before.png','calc_after.png',
   'donna_scroll.png','home_mobscroll.png',
   ...B.pages.map(p=>p[0]+'_desktop.png')];
  await Promise.all(list.map(f=>new Promise(res=>{const i=new Image();i.onload=i.onerror=()=>res();i.src='assets/'+f;})));
  if(document.fonts&&document.fonts.ready) await document.fonts.ready;
}

let t=0, playing=false, raf=0, last=0, ac=null, node=null, soundOn=true, audioStart=0;
export function setTime(v){ t=Math.max(0,Math.min(TOTAL,v)); render(t); paint(); }
function paint(){ document.getElementById('clock').textContent=t.toFixed(1)+' / '+TOTAL.toFixed(1)+' s'; }
function loop(ts){
  if(!playing)return;
  if(!last)last=ts;
  t+=(ts-last)/1000; last=ts;
  if(t>=TOTAL){ t=TOTAL; playing=false; document.getElementById('play').textContent='↻'; }
  render(t); paint(); if(playing) raf=requestAnimationFrame(loop);
}
function startAudio(){
  if(!soundOn)return;
  if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)();
  if(ac.state==='suspended') ac.resume();
  stopAudio();
  node=scheduleTrack(ac,ac.destination,ac.currentTime+0.05-Math.min(t,0));
  audioStart=ac.currentTime-t;
}
function stopAudio(){ if(node){try{node.disconnect()}catch(e){} node=null;} if(ac){ac.close();ac=null;} }
function play(){ if(t>=TOTAL)t=0; playing=true; last=0; document.getElementById('play').textContent='❚❚';
  startAudio(); raf=requestAnimationFrame(loop); }
function pause(){ playing=false; cancelAnimationFrame(raf); stopAudio(); document.getElementById('play').textContent='▶'; }
document.getElementById('play').onclick=()=>playing?pause():play();
addEventListener('keydown',e=>{
  if(e.code==='Space'){e.preventDefault();playing?pause():play();}
  if(e.code==='ArrowRight'){const m=MARKS.find(m=>m.t0>t+.05)||MARKS[MARKS.length-1];pause();setTime(m.t0);}
  if(e.code==='ArrowLeft'){const p=[...MARKS].reverse().find(m=>m.t0<t-.35)||MARKS[0];pause();setTime(p.t0);}
  if(e.key==='s'||e.key==='S'){soundOn=!soundOn;if(!soundOn)stopAudio();else if(playing)startAudio();}
});

(async()=>{
  buildScene();
  await preload();
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  // mesure apres layout
  const {objects}=await import('./shots.js');
  const {measure}=await import('./scene.js');
  Object.values(objects()).flatMap(v=>Array.isArray(v)?v:[v]).filter(o=>o&&o.nodeType).forEach(measure);
  render(0); paint();
  window.setTime=v=>{t=v;render(v);paint();};
  window.TOTAL=TOTAL; window.MARKS=MARKS; window.READY=true;
  if(!location.search.includes('export')) setTimeout(()=>{ if(!playing) play(); }, 700);
})();
