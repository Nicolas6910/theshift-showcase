import B from './brand.js';
import {clamp,lerp,inv,E,seg,win,rng,place,hide,nfr} from './utils.js';
import * as S from './scene.js';
import {applyCam,camLerp,dof} from './camera.js';
import {cursorMove,cursorHide,pressScale,count,caption,captionHide} from './ui-sim.js';

/* dimensions reelles des assets (px) — aucune image n'est etiree */
export const DIM={
  logo:[949,444], home_desktop:[1920,1200], donna_desktop:[1920,1200], produits_desktop:[1920,1200],
  mfa_desktop:[1920,1200], services_desktop:[1920,1200], pricing_desktop:[1920,1200],
  formation_desktop:[1920,1200], references_desktop:[1920,1200], casusage_desktop:[1920,1200],
  conseil_desktop:[1920,1200], contact_desktop:[1920,1200],
  home_nav:[1500,78], home_hero:[1500,1183], home_results:[1500,868], home_services:[1500,1080],
  home_why:[1500,1394], home_cta:[1500,514], stats_band:[1800,244],
  tab_Chatbot:[1500,1080], tab_Email:[1500,1066], tab_Veille:[1500,1066],
  calc_before:[1500,805], calc_after:[1500,805],
  mfa_hero:[1500,770], mfa_result:[1500,391], refs_grid:[1500,1746], pricing_packs:[1500,884],
  home_mobile:[760,1645], home_mobscroll:[760,4417], donna_scroll:[1400,3403], home_scroll:[1400,3403],
};
const ar=k=>DIM[k][1]/DIM[k][0];

/* ---- timeline : 12 plans ---- */
export const SHOTS=[
  ['cold',4.2],['hero',5.8],['promise',5.4],['stats',6.2],['exploded',7.4],['services',6.0],
  ['donna',5.4],['calc',5.2],['devices',4.0],['carousel',4.0],['proof',3.8],['end',3.6],
];
export const MARKS=(()=>{let a=0;return SHOTS.map(([id,d])=>{const o={id,t0:a,t1:a+d,dur:d};a+=d;return o;});})();
export const TOTAL=MARKS[MARKS.length-1].t1;
const M=Object.fromEntries(MARKS.map(m=>[m.id,m]));

let O={};           // registre d'objets
const R=rng(20260924);
const DUST=Array.from({length:150},()=>({x:R()*1920,y:R()*1080,r:R()*2.1+.5,sp:R()*.42+.12,ph:R()*Math.PI*2,a:R()*.5+.18}));

function card(w,key,cls){
  const o=S.imgLayer(w,key+'.png',null,cls||'card3d');
  o._h=Math.round(w*ar(key)); o.style.height=o._h+'px'; o._im.style.height='100%';
  o._im.style.backgroundSize='100% auto'; return o;
}
function miniWin(w,key,path){
  const h=Math.round(w*ar(key)), o=S.browserWindow(w,h+34,B.url,[{id:'s',file:key+'.png'}]);
  o.querySelector('.chrome').style.height='34px';
  o.querySelector('.addr').style.fontSize='10px';
  o._path.textContent=path; return o;
}

export function buildScene(){
  const W=document.getElementById('world');
  const add=(o)=>{W.appendChild(o);return o;};
  O={};
  O.logo=add(S.logoBlock());
  O.winShadow=add(S.contactShadow(1180,240));
  O.win=add(S.browserWindow(1280,844,B.url,[
    {id:'home',file:'home_desktop.png'},{id:'donna',file:'donna_desktop.png'},
    {id:'mfa',file:'mfa_desktop.png'},{id:'produits',file:'produits_desktop.png'},
  ]));
  O.win._path.textContent='';
  // grand plan sur le hero (push-in du plan 3)
  O.hero=add(card(1340,'home_hero'));
  // plan 4 : bandeau stats + 4 cartes
  O.band=add(card(1560,'stats_band'));
  O.stats=B.stats.map(s=>add(S.statCard(s)));
  O.statsSrc=add(S.text3(B.statsSource,17,'sub'));
  // plan 5 : couches eclatees
  O.layers=[['home_nav','Navigation'],['home_hero','Hero'],['stats_band','Chiffres'],
            ['home_results','Résultats'],['home_services','Modules'],['home_cta','Conversion']]
    .map(([k,tag])=>{const o=add(card(1120,k,'layer'));const t=document.createElement('div');
      t.className='tag';t.textContent=tag;o.appendChild(t);o._tag=t;return o;});
  // plan 6 : onglets services
  O.tabA=add(card(1180,'tab_Chatbot'));
  O.tabB=add(card(1180,'tab_Email'));
  O.tabC=add(card(1180,'tab_Veille'));
  // plan 7 : donna, scroll interne
  O.donna=add(S.browserWindow(1180,782,B.url,[{id:'s',file:'donna_scroll.png'}]));
  O.donna._path.textContent='/produits/donna';
  O.donna._shots.s.style.backgroundSize='100% auto';
  O.donnaBadge=add(S.chip('Employée IA de direction'));
  // plan 8 : calculateur
  O.calcA=add(card(1150,'calc_before'));
  O.calcB=add(card(1150,'calc_after'));
  O.calcNum=add(S.text3('0 €',104,'grad'));
  O.calcLbl=add(S.text3("Coût annuel du processus — calculateur du site",22,'sub'));
  // plan 9 : multi-device
  O.laptop=add(S.laptop(980,'produits_desktop.png'));
  O.phone=add(S.phone(330,'home_mobscroll.png'));
  O.phone._screen.style.backgroundSize='100% auto';
  O.deskShadow=add(S.contactShadow(1000,200));
  // plan 10 : arc de pages
  O.arc=B.pages.map(([k,label,path])=>{const o=add(miniWin(620,k+'_desktop',path));o._label=label;return o;});
  // plan 11 : preuve
  O.proofTitle=add(S.text3('MFA&nbsp;: 14 marques et 400 documents<br>tiennent dans un seul agent IA',46));
  O.proofFigs=B.mfa.figures.map(f=>{const o=add(S.text3('0',92,'grad'));o._spec=f;
    const l=add(S.text3(f.l,21,'sub'));o._lbl=l;return o;});
  O.clients=B.clients.map(c=>add(S.text3(c,30,'sub')));
  // plan 12 : carte de fin
  O.endCta=add(S.text3(`<span class="endcta">${B.cta}</span>`,1));
  O.endUrl=add(S.text3(`<span class="endurl">${B.href.replace(/^https?:\/\//,'').replace(/\/$/,'')}</span>`,1));
  // mesures apres layout
  requestAnimationFrame(()=>Object.values(O).flat().forEach(o=>o&&o.nodeType&&S.measure(o)));
  return O;
}
export const objects=()=>O;

const all=()=>Object.values(O).flatMap(v=>Array.isArray(v)?v:[v]).filter(o=>o&&o.nodeType);
function hideAll(){all().forEach(hide); cursorHide(); captionHide();}
function shotOp(o,id,v){ if(o._shots&&o._shots[id]) o._shots[id].style.opacity=v; }

/* ================= PLANS ================= */
function coldOpen(t,g){ // 0 -> 4.2 : particules -> logo reel
  const L=O.logo, k=seg(t,.15,2.0,E.outQuint);
  const outk=seg(t,3.5,4.2,E.inOut);
  L._mask.style.height=(k*(L._img.offsetHeight||190)+2)+'px';
  L._mask.style.width=(L._img.offsetWidth||520)+'px';
  L._eb.style.opacity=(seg(t,1.35,2.3,E.outQuint)*(1-outk)).toFixed(3);
  L._eb.style.letterSpacing=(lerp(.62,.34,seg(t,1.35,2.6,E.outExpo))).toFixed(3)+'em';
  place(L,{x:0,y:-14,z:lerp(-260,30,E.outQuint(clamp(inv(0,3.0,t)))),
    s:lerp(.86,1.0,E.outExpo(clamp(inv(0,2.4,t)))),o:clamp(seg(t,.05,.6)-outk),rz:lerp(-2.2,0,E.outQuint(clamp(inv(0,2.4,t))))});
  applyCam({x:0,y:0,z:lerp(-220,40,E.inOutQuint(clamp(inv(0,4.2,t)))),rx:lerp(5.5,0,E.inOutQuint(clamp(inv(0,3.4,t)))),ry:0,dof:0});
  g.dustFlow=lerp(2.2,.35,E.outExpo(clamp(inv(0,2.6,t))));
  g.gridK=.35+.3*E.out(clamp(inv(.4,3,t)));
  caption(t,{eyebrow:'',text:'',t0:0,t1:0});
}
function heroReveal(t,g){ // 4.2 -> 10.0 : la fenetre monte de la profondeur
  const lt=t-M.hero.t0, k=E.outQuint(clamp(inv(0,2.6,lt))), k2=E.inOutQuint(clamp(inv(.4,5.8,lt)));
  const fade=seg(t,M.hero.t0-.35,M.hero.t0+.35);
  shotOp(O.win,'home',1); shotOp(O.win,'donna',0); shotOp(O.win,'mfa',0); shotOp(O.win,'produits',0);
  O.win._path.textContent='';
  const ry=lerp(-26,-7,k2), rx=lerp(11,3.2,k2), y=lerp(280,10,k), z=lerp(-680,-40,k);
  place(O.win,{x:0,y,z,rx,ry,o:fade,s:lerp(.92,1,k)});
  place(O.winShadow,{x:26,y:y+430,z:z-70,o:fade*lerp(.1,.5,k),s:lerp(.7,1,k)});
  O.win._glare.style.opacity=(0.55*(1-k2)+.12).toFixed(3);
  O.win._glare.style.transform=`translateX(${lerp(-46,42,k2).toFixed(1)}%)`;
  applyCam({x:0,y:lerp(-40,0,k2),z:lerp(40,150,k2),rx:lerp(3.5,0,k2),ry:lerp(6,0,k2),dof:0});
  g.gridK=.62; g.dustFlow=.35;
  caption(t,{eyebrow:B.eyebrow,text:'the-shift.ai',t0:M.hero.t0+1.5,t1:M.hero.t1-.2});
}
function promise(t,g){ // 10.0 -> 15.4 : push-in sur le H1 reel + rack focus
  const lt=t-M.promise.t0, k=E.inOutQuint(clamp(inv(0,4.6,lt)));
  const fade=win(t,M.promise.t0-.45,M.promise.t0+.15,M.promise.t1-.5,M.promise.t1);
  // la fenetre reste en place et s'eloigne dans le flou (continuite du plan 2)
  place(O.win,{x:0,y:10,z:-40-160*k,rx:3.2,ry:-7+3*k,o:clamp(1-seg(t,M.promise.t0+.1,M.promise.t0+1.0)),blur:6*k});
  place(O.winShadow,{x:26,y:440,z:-110,o:clamp(.5-seg(t,M.promise.t0,M.promise.t0+.9))*.5});
  // la section hero, en carte flottante, arrive au premier plan
  const app=seg(t,M.promise.t0+.35,M.promise.t0+1.5,E.outQuint);
  place(O.hero,{x:lerp(80,-30,k),y:lerp(60,-30,k),z:lerp(-140,300,k),rx:lerp(8.5,2.4,k),ry:lerp(14,3.5,k),
    o:fade*app,s:lerp(.96,1.06,k)});
  applyCam({x:lerp(-60,40,k),y:lerp(30,-20,k),z:lerp(60,230,k),rx:lerp(-2,1.2,k),ry:lerp(-3.5,1.6,k),dof:0});
  g.gridK=.5;
  caption(t,{eyebrow:'La promesse du site',text:'Ou elle ne sera plus.',t0:M.promise.t0+1.6,t1:M.promise.t1-.15});
}
function stats(t,g){ // 15.4 -> 21.6 : compteurs sur les 4 chiffres reels
  const lt=t-M.stats.t0;
  const fade=win(t,M.stats.t0-.1,M.stats.t0+.5,M.stats.t1-.55,M.stats.t1);
  const travel=E.inOutQuint(clamp(inv(.2,6.0,lt)));
  place(O.band,{x:0,y:-330,z:-260,rx:6,ry:lerp(9,-9,travel),o:fade*.96,blur:lerp(1.6,0,E.out(clamp(inv(0,1.6,lt))))});
  O.stats.forEach((s,i)=>{
    const d=.18+i*.085, k=E.spring(clamp(inv(d,d+1.25,lt)));
    const kk=clamp(inv(d,d+1.25,lt));
    const x=(i-1.5)*398, par=lerp(30,-30,travel)*(1+i*.12);
    place(s,{x:x+par,y:lerp(150,72,E.outQuint(kk)),z:lerp(-220,90-i*16,E.outQuint(kk)),
      rx:lerp(13,2.6,E.outQuint(kk)),ry:lerp(-14,(i-1.5)*3.4,E.outQuint(kk)),o:fade*clamp(kk*2.2),s:lerp(.9,1,k)});
    const c0=d+.42;
    s._v.textContent=count(lt,c0,c0+1.5,0,s._spec.v)+s._spec.suf;
    s._bar.style.width=(E.outExpo(clamp(inv(c0,c0+1.7,lt)))*100).toFixed(1)+'%';
  });
  place(O.statsSrc,{x:lerp(30,-30,travel),y:300,z:60,o:fade*seg(t,M.stats.t0+1.9,M.stats.t0+2.8)*.8});
  applyCam({x:lerp(-90,90,travel),y:lerp(20,-14,travel),z:lerp(120,10,travel),ry:lerp(-3.2,3.2,travel),rx:.8,dof:0});
  g.gridK=.45;
  caption(t,{eyebrow:'Ce que dit la page',text:'94 % n’en tirent aucune valeur.',t0:M.stats.t0+2.5,t1:M.stats.t1-.2});
}
function exploded(t,g){ // 21.6 -> 29.0 : PLAN SIGNATURE, la home se decompose
  const lt=t-M.exploded.t0;
  const fade=win(t,M.exploded.t0-.15,M.exploded.t0+.55,M.exploded.t1-.6,M.exploded.t1);
  const openK=E.outQuint(clamp(inv(.5,3.4,lt)));            // ecartement
  const closeK=E.spring(clamp(inv(5.0,6.9,lt)),2.6,5.2);     // re-snap avec overshoot
  const sep=lerp(0,1,openK)*(1-clamp(closeK));
  const orbit=E.inOutQuint(clamp(inv(.4,5.2,lt)));
  const N=O.layers.length;
  O.layers.forEach((L,i)=>{
    const c=i-(N-1)/2;
    const z=c*205*sep, y=c*128*sep - 20, x=c*26*sep;
    place(L,{x,y,z,rx:lerp(2,15.5,sep),ry:lerp(0,-3.5,sep),o:fade,s:lerp(1,.9,sep*.5)});
    L._tag.style.opacity=(fade*E.out(clamp(inv(.9+i*.09,1.9+i*.09,lt)))*(1-clamp(closeK))).toFixed(3);
    L.style.filter=dof(z)>0.05?`blur(${dof(z).toFixed(2)}px)`:'none';
  });
  applyCam({x:lerp(-30,60,orbit),y:lerp(-10,26,orbit),z:lerp(-30,lerp(-120,120,closeK),Math.min(orbit,1)),
    ry:lerp(-19,21,orbit),rx:lerp(-3,7.5,orbit),focus:0,dof:.006*sep});
  g.gridK=.55;
  caption(t,{eyebrow:'Anatomie de la page',text:'Une page, six couches.',t0:M.exploded.t0+1.5,t1:M.exploded.t1-.9});
}
function services(t,g){ // 29.0 -> 35.0 : le curseur clique un onglet reel
  const lt=t-M.services.t0, T0=M.services.t0;
  const fade=win(t,T0-.3,T0+.4,M.services.t1-.5,M.services.t1);
  const k=E.inOutQuint(clamp(inv(.2,5.4,lt)));
  const click1=1.85, click2=3.85;
  const sw1=E.out(clamp(inv(click1+.02,click1+.4,lt)));    // Chatbot -> Email
  const sw2=E.out(clamp(inv(click2+.02,click2+.4,lt)));    // Email -> Veille
  const base={x:0,y:lerp(40,-10,k),z:lerp(-70,150,k),rx:lerp(8,2.2,k),ry:lerp(-13,4,k)};
  place(O.tabA,{...base,o:fade*(1-sw1)});
  place(O.tabB,{...base,o:fade*sw1*(1-sw2)});
  place(O.tabC,{...base,o:fade*sw2});
  applyCam({x:lerp(-40,30,k),y:0,z:lerp(40,140,k),ry:lerp(3.2,-2.4,k),rx:.6,dof:0});
  // le curseur va sur les onglets (coordonnees ecran, calees sur la carte)
  if(lt>.5&&lt<5.4){
    const p=cursorMove(lt,{from:[1310,760],to:[770,430],t0:.55,t1:click1,click:click1});
    if(lt>click1+.35) cursorMove(lt,{from:[770,430],to:[905,430],t0:click1+.5,t1:click2,click:click2});
  } else cursorHide();
  g.gridK=.42;
  caption(t,{eyebrow:'Ce qu’on déploie',text:'Six modules, connectables.',t0:T0+.6,t1:M.services.t1-.25});
}
function donna(t,g){ // 35.0 -> 40.4 : scroll reel dans la fenetre
  const lt=t-M.donna.t0, T0=M.donna.t0;
  const fade=win(t,T0-.25,T0+.35,M.donna.t1-.5,M.donna.t1);
  const k=E.inOutQuint(clamp(inv(0,5.0,lt)));
  const scrollK=E.inOutQuint(clamp(inv(.85,4.3,lt)));
  const maxScroll=1180*ar('donna_scroll')-740;
  O.donna._shots.s.style.transform=`translateY(${(-scrollK*maxScroll).toFixed(1)}px)`;
  O.donna._shots.s.style.height=(1180*ar('donna_scroll'))+'px';
  place(O.donna,{x:lerp(-140,60,k),y:lerp(30,-6,k),z:lerp(-120,120,k),rx:lerp(7.5,2,k),ry:lerp(17,-5.5,k),o:fade});
  place(O.winShadow,{x:lerp(-120,80,k),y:lerp(450,410,k),z:lerp(-190,50,k),o:fade*.42,s:.94});
  place(O.donnaBadge,{x:lerp(470,520,k),y:lerp(-330,-300,k),z:lerp(-40,220,k),ry:lerp(14,-4,k),rx:3,
    o:fade*E.outQuint(clamp(inv(.7,1.7,lt)))});
  applyCam({x:lerp(60,-30,k),y:lerp(-10,10,k),z:lerp(60,120,k),ry:lerp(-5,3,k),rx:1.2,dof:0});
  cursorHide(); g.gridK=.38;
  caption(t,{eyebrow:'Produit',text:'Donna — employée IA de direction.',t0:T0+.5,t1:M.donna.t1-.25});
}
function calc(t,g){ // 40.4 -> 45.6 : le curseur tire un curseur du site, le chiffre suit
  const lt=t-M.calc.t0, T0=M.calc.t0;
  const fade=win(t,T0-.25,T0+.35,M.calc.t1-.5,M.calc.t1);
  const k=E.inOutQuint(clamp(inv(0,4.8,lt)));
  const drag0=1.15, drag1=2.65;
  const sw=E.inOut(clamp(inv(drag0+.15,drag1,lt)));
  const base={x:lerp(-30,30,k),y:lerp(90,60,k),z:lerp(-60,180,k),rx:lerp(8,2.4,k),ry:lerp(-12,4.5,k)};
  place(O.calcA,{...base,o:fade*(1-sw)});
  place(O.calcB,{...base,o:fade*sw});
  const v=lerp(92400,316800,E.inOut(clamp(inv(drag0+.1,drag1+.25,lt))));
  O.calcNum.innerHTML=nfr(Math.round(v/100)*100)+'&nbsp;€';
  place(O.calcNum,{x:lerp(-30,30,k),y:lerp(-360,-330,k),z:lerp(0,240,k),ry:lerp(-8,3,k),rx:2,
    o:fade*E.outQuint(clamp(inv(.45,1.35,lt)))});
  place(O.calcLbl,{x:lerp(-30,30,k),y:lerp(-278,-248,k),z:lerp(0,240,k),ry:lerp(-8,3,k),
    o:fade*E.outQuint(clamp(inv(.7,1.6,lt)))*.85});
  applyCam({x:lerp(30,-20,k),y:lerp(30,-10,k),z:lerp(50,120,k),ry:lerp(3,-2,k),rx:1,dof:0});
  if(lt>.4&&lt<4.6) cursorMove(lt,{from:[1480,820],to:[906,742],t0:.45,t1:drag0,click:drag0});
  else cursorHide();
  if(lt>=drag0&&lt<drag1+.3){ // deplacement du curseur pendant le drag
    cursorMove(lt,{from:[906,742],to:[1042,742],t0:drag0,t1:drag1,click:drag0});
  }
  g.gridK=.42;
  caption(t,{eyebrow:'Calculateur d’économies',text:'Vos économies, chiffrées.',t0:T0+.5,t1:M.calc.t1-.25});
}
function devices(t,g){ // 45.6 -> 49.6 : formation desktop + laptop + telephone
  const lt=t-M.devices.t0, T0=M.devices.t0;
  const fade=win(t,T0-.3,T0+.5,M.devices.t1-.55,M.devices.t1);
  const k=E.inOutQuint(clamp(inv(0,4.0,lt)));
  const en=i=>E.outQuint(clamp(inv(.1+i*.14,1.5+i*.14,lt)));
  shotOp(O.win,'home',1); shotOp(O.win,'donna',0); shotOp(O.win,'mfa',0); shotOp(O.win,'produits',0);
  O.win._path.textContent='';
  place(O.win,{x:lerp(-150,-95,k),y:lerp(-40,-24,k),z:lerp(-260,-180,k),rx:4,ry:lerp(19,10,k),
    o:fade*en(0),s:.86,blur:0});
  place(O.laptop,{x:lerp(370,420,k),y:lerp(180,160,k),z:lerp(60,130,k),rx:lerp(7,4,k),ry:lerp(-20,-12,k),
    o:fade*en(1),s:lerp(.9,.96,en(1))});
  const ms=760*ar('home_mobscroll'), mh=330*2.164;
  O.phone._screen.style.height=(330*ar('home_mobscroll')*(760/760))+'px';
  O.phone._screen.style.transform=`translateY(${(-E.inOutQuint(clamp(inv(.6,3.6,lt)))*(330*ar('home_mobscroll')-mh+40)).toFixed(1)}px)`;
  place(O.phone,{x:lerp(-560,-520,k),y:lerp(210,190,k),z:lerp(220,300,k),rx:lerp(5,2,k),ry:lerp(23,14,k),
    o:fade*en(2),s:lerp(.92,1,en(2))});
  place(O.deskShadow,{x:380,y:430,z:40,o:fade*.34*en(1)});
  applyCam({x:lerp(120,-70,k),y:lerp(-20,15,k),z:lerp(-30,60,k),ry:lerp(-7.5,6,k),rx:lerp(-1.5,2.5,k),
    focus:130,dof:.0045});
  cursorHide(); g.gridK=.5;
  caption(t,{eyebrow:'Quinze pages capturées',text:'Une marque, trois écrans.',t0:T0+.5,t1:M.devices.t1-.25});
}
function carousel(t,g){ // 49.6 -> 53.6 : arc 3D de pages, balayage camera
  const lt=t-M.carousel.t0, T0=M.carousel.t0;
  const fade=win(t,T0-.3,T0+.45,M.carousel.t1-.55,M.carousel.t1);
  const sweep=E.inOutQuint(clamp(inv(.05,3.9,lt)));
  const N=O.arc.length, RAD=1180, spanDeg=132;
  O.arc.forEach((w,i)=>{
    const a0=(i/(N-1)-.5)*spanDeg, a=(a0 - lerp(-34,34,sweep))*Math.PI/180;
    const x=Math.sin(a)*RAD, z=Math.cos(a)*RAD-RAD+180;
    const en=E.outQuint(clamp(inv(.05+i*.055,1.1+i*.055,lt)));
    const d=Math.abs(x)/RAD;
    place(w,{x,y:lerp(90,26,en)+Math.sin(i*1.7)*16,z:z*1.0,ry:-(a0-lerp(-34,34,sweep))*.82,rx:2.6,
      o:fade*en*clamp(1.25-d*1.05),s:lerp(.9,1,en),blur:d*3.4});
  });
  applyCam({x:0,y:lerp(-20,10,sweep),z:lerp(-40,30,sweep),ry:lerp(2.5,-2.5,sweep),rx:lerp(2,-1,sweep),dof:0});
  cursorHide(); g.gridK=.6;
  caption(t,{eyebrow:'Le site, en entier',text:'Quinze pages, une identité.',t0:T0+.45,t1:M.carousel.t1-.25});
}
function proof(t,g){ // 53.6 -> 57.4 : etude de cas MFA, chiffres reels
  const lt=t-M.proof.t0, T0=M.proof.t0;
  const fade=win(t,T0-.3,T0+.45,M.proof.t1-.5,M.proof.t1);
  const k=E.inOutQuint(clamp(inv(0,3.8,lt)));
  shotOp(O.win,'home',0); shotOp(O.win,'donna',0); shotOp(O.win,'produits',0); shotOp(O.win,'mfa',1);
  O.win._path.textContent='/references/mfa';
  place(O.win,{x:lerp(-40,20,k),y:lerp(240,205,k),z:lerp(-340,-190,k),rx:lerp(11,7,k),ry:lerp(-13,-5,k),
    o:fade*E.outQuint(clamp(inv(.05,1.3,lt)))*.97,s:.8,blur:lerp(1.8,0,E.out(clamp(inv(0,1.2,lt))))});
  place(O.proofTitle,{x:lerp(-20,10,k),y:lerp(-330,-300,k),z:lerp(40,180,k),ry:lerp(-6,2,k),
    o:fade*E.outQuint(clamp(inv(.2,1.2,lt)))});
  O.proofFigs.forEach((f,i)=>{
    const d=.55+i*.15, kk=clamp(inv(d,d+1.2,lt)), x=(i-1)*430;
    f.textContent=count(lt,d,d+1.2,0,f._spec.v)+f._spec.suf;
    place(f,{x:x+lerp(-16,16,k),y:lerp(-120,-140,k),z:lerp(0,200,k),ry:lerp(-5,2,k),
      o:fade*clamp(kk*2.4),s:lerp(.86,1,E.spring(kk))});
    place(f._lbl,{x:x+lerp(-16,16,k),y:lerp(-40,-58,k),z:lerp(0,200,k),ry:lerp(-5,2,k),o:fade*clamp(kk*2)*.8});
  });
  O.clients.forEach((c,i)=>{
    const d=1.5+i*.1, kk=E.outQuint(clamp(inv(d,d+.85,lt)));
    place(c,{x:(i-2)*300,y:lerp(60,44,k),z:lerp(-20,150,k),ry:lerp(-5,2,k),o:fade*kk*.62,s:lerp(.92,1,kk)});
  });
  applyCam({x:lerp(20,-10,k),y:lerp(30,-20,k),z:lerp(0,90,k),ry:lerp(2.5,-1.5,k),rx:lerp(-1,2,k),dof:0});
  cursorHide(); g.gridK=.5;
  caption(t,{eyebrow:'Référence en production',text:'',t0:T0+.4,t1:M.proof.t1-.2});
}
function endcard(t,g){ // 57.4 -> 61.0
  const lt=t-M.end.t0, T0=M.end.t0;
  const fade=seg(t,T0-.2,T0+.55,E.outQuint);
  const k=E.outQuint(clamp(inv(0,2.6,lt)));
  const L=O.logo;
  L._mask.style.height='auto'; L._mask.style.width='auto';
  L._eb.style.opacity=(fade*E.outQuint(clamp(inv(.5,1.5,lt)))).toFixed(3);
  L._eb.style.letterSpacing='.34em';
  place(L,{x:0,y:-180,z:lerp(-80,60,k),o:fade,s:lerp(.9,1,k)});
  place(O.endCta,{x:0,y:lerp(110,86,E.spring(clamp(inv(.7,2.0,lt)),2.4,5)),z:lerp(-40,90,k),
    o:fade*E.outQuint(clamp(inv(.65,1.5,lt)))});
  place(O.endUrl,{x:0,y:lerp(212,196,k),z:lerp(-40,90,k),o:fade*E.outQuint(clamp(inv(1.0,1.9,lt)))*.9});
  applyCam({x:0,y:0,z:lerp(70,-10,E.inOutQuint(clamp(inv(0,3.6,lt)))),rx:0,ry:0,dof:0});
  g.dustFlow=lerp(.35,1.9,E.in(clamp(inv(1.2,3.6,lt))));
  g.gridK=lerp(.5,.18,E.inOut(clamp(inv(1.0,3.4,lt))));
  caption(t,{eyebrow:'',text:'',t0:0,t1:0});
}
const FN={cold:coldOpen,hero:heroReveal,promise,stats,exploded,services,donna,calc,devices,carousel,proof,end:endcard};

/* ---------- decor anime ---------- */
function bg(t,g){
  const m1=document.querySelector('.m1'),m2=document.querySelector('.m2'),m3=document.querySelector('.m3');
  m1.style.transform=`translate3d(${Math.sin(t*.21)*90}px,${Math.cos(t*.17)*60}px,0) scale(${1+Math.sin(t*.13)*.08})`;
  m2.style.transform=`translate3d(${Math.cos(t*.19)*-110}px,${Math.sin(t*.23)*70}px,0) scale(${1+Math.cos(t*.15)*.09})`;
  m3.style.transform=`translate3d(${Math.sin(t*.14+1.7)*130}px,${Math.cos(t*.2)*-50}px,0) scale(${1+Math.sin(t*.11+2)*.07})`;
  const gi=document.getElementById('gridinner');
  gi.style.transform=`rotateX(74deg) translateY(${(-(t*26)%76).toFixed(2)}px)`;
  document.getElementById('grid').style.opacity=(g.gridK!=null?g.gridK:.5).toFixed(3);
  const c=document.getElementById('dust'), x=c.getContext('2d');
  x.clearRect(0,0,1920,1080);
  const flow=g.dustFlow!=null?g.dustFlow:.5;
  for(const p of DUST){
    const px=(p.x+Math.sin(t*p.sp+p.ph)*44*flow+1920)%1920;
    const py=(p.y-t*p.sp*26*flow+1080*4)%1080;
    x.beginPath(); x.arc(px,py,p.r*(1+flow*.22),0,6.2832);
    x.fillStyle=`rgba(37,99,235,${(p.a*(.28+flow*.3)).toFixed(3)})`; x.fill();
  }
}

/* ---------- rendu global ---------- */
export function render(t){
  t=Math.max(0,Math.min(TOTAL-0.0001,t));
  hideAll();
  const g={};
  const cur=MARKS.find(m=>t>=m.t0&&t<m.t1)||MARKS[MARKS.length-1];
  const idx=MARKS.indexOf(cur);
  // recouvrement court avec le plan voisin : la coupe est portee par le mouvement, pas par un fondu
  const prev=MARKS[idx-1], next=MARKS[idx+1];
  if(prev && t<cur.t0+.45) FN[prev.id](t,g);
  FN[cur.id](t,g);
  if(next && t>cur.t1-.45) FN[next.id](t,g);
  bg(t,g);
  const p=document.querySelector('#progress i'); if(p) p.style.width=(t/TOTAL*100).toFixed(2)+'%';
}
