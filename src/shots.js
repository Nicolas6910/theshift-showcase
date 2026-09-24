import B from './brand.js';
import {clamp,lerp,inv,E,seg,win,rng,place,hide,nfr} from './utils.js';
import * as S from './scene.js';
import {applyCam,camLerp,dof} from './camera.js';
import {cursorMove,cursorHide,pressScale,count,caption,captionHide} from './ui-sim.js';

/* dimensions reelles des assets — aucune image n'est etiree */
export const DIM={
  logo:[949,444], home_desktop:[1920,1200], donna_desktop:[1920,1200], produits_desktop:[1920,1200],
  mfa_desktop:[1920,1200], services_desktop:[1920,1200], pricing_desktop:[1920,1200],
  formation_desktop:[1920,1200], references_desktop:[1920,1200], casusage_desktop:[1920,1200],
  conseil_desktop:[1920,1200], contact_desktop:[1920,1200],
  band_nav:[1400,74], band_hero:[1400,170], band_results:[1400,170], band_services:[1400,170],
  band_why:[1400,170], band_cta:[1400,170], mfa_proof:[1400,885],
  home_nav:[1500,78], home_hero:[1500,1183], home_results:[1500,868], home_services:[1500,1080],
  home_why:[1500,1394], home_cta:[1500,514], stats_band:[1800,244],
  tab_Chatbot:[1500,1080], tab_Email:[1500,1066], tab_Veille:[1500,1066],
  calc_before:[1500,805], calc_after:[1500,805],
  mfa_hero:[1500,770], mfa_context:[1500,815], mfa_result:[1500,391], refs_grid:[1500,1746],
  home_mobile:[760,1645], home_mobscroll:[760,4417], donna_scroll:[1400,3403],
};
const ar=k=>DIM[k][1]/DIM[k][0];
const P=1600;                                  // perspective du #camera
/** z qui fait occuper a un objet w x h au plus fw de la largeur et fh de la hauteur du cadre.
 *  Garantit la regle : jamais bord a bord, toujours de la marge. */
export function zfit(w,h,fw=.84,fh=.76){
  const s=Math.min(1920*fw/w, 1080*fh/h);
  return P*(1-1/s);
}

export const SHOTS=[
  ['cold',4.2],['hero',5.8],['promise',5.4],['stats',6.2],['exploded',7.4],['services',6.0],
  ['donna',5.4],['calc',5.2],['devices',4.0],['carousel',4.0],['proof',3.8],['end',3.6],
];
export const MARKS=(()=>{let a=0;return SHOTS.map(([id,d])=>{const o={id,t0:a,t1:a+d,dur:d};a+=d;return o;});})();
export const TOTAL=MARKS[MARKS.length-1].t1;
const M=Object.fromEntries(MARKS.map(m=>[m.id,m]));

let O={};
const R=rng(20260924);
const DUST=Array.from({length:170},()=>({x:R()*1920,y:R()*1080,r:R()*2.2+.5,sp:R()*.42+.12,ph:R()*Math.PI*2,a:R()*.5+.2}));

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
const reg=[];                                   // tout objet doit etre enregistre pour etre cache
const keep=o=>{reg.push(o);return o;};

export function buildScene(){
  const W=document.getElementById('world'); reg.length=0;
  const add=o=>{W.appendChild(o);return keep(o);};
  O={};
  O.logo=add(S.logoBlock());
  O.coldLine=add(S.text3(B.tagline,26,'sub'));
  O.coldRule=add(S.text3('<span style="display:block;width:280px;height:3px;border-radius:2px;background:linear-gradient(90deg,#2563eb00,#2563eb,#7c3aed,#7c3aed00)"></span>',1));
  O.winShadow=add(S.contactShadow(1180,240));
  O.win=add(S.browserWindow(1280,844,B.url,[
    {id:'home',file:'home_desktop.png'},{id:'mfa',file:'mfa_desktop.png'},{id:'produits',file:'produits_desktop.png'},
  ]));
  O.win._path.textContent='';
  O.hero=add(card(1340,'home_hero'));
  O.stats=B.stats.map(s=>add(S.statCard(s)));
  O.statsSrc=add(S.text3(B.statsSource,17,'sub'));
  O.layers=[['band_nav','Navigation'],['band_hero','Hero'],['band_results','Résultats'],
            ['band_services','Modules'],['band_why','Preuves'],['band_cta','Conversion']]
    .map(([k,tag])=>{const o=add(card(860,k,'layer'));const t=document.createElement('div');
      t.className='tag';t.textContent=tag;o.appendChild(t);o._tag=t;return o;});
  O.tabA=add(card(1180,'tab_Chatbot'));
  O.tabB=add(card(1180,'tab_Email'));
  O.tabC=add(card(1180,'tab_Veille'));
  O.hsEmail=S.hotspot(O.tabA,0.1490,0.2585);
  O.hsVeille=S.hotspot(O.tabB,0.2268,0.2585);
  O.hsStart=S.hotspot(O.tabA,0.74,0.80);
  O.donna=add(S.browserWindow(1180,782,B.url,[{id:'s',file:'donna_scroll.png'}]));
  O.donna._path.textContent='/produits/donna';
  O.donna._shots.s.style.backgroundSize='100% auto';
  O.calcA=add(card(1150,'calc_before'));
  O.calcB=add(card(1150,'calc_after'));
  O.hsSlid0=S.hotspot(O.calcA,0.184+0.333*0.282,0.614);
  O.hsSlid1=S.hotspot(O.calcA,0.184+0.467*0.282,0.614);
  O.hsCalcStart=S.hotspot(O.calcA,0.80,0.90);
  O.laptop=add(S.laptop(920,'produits_desktop.png'));
  O.phone=add(S.phone(310,'home_mobscroll.png'));
  O.phone._screen.style.backgroundSize='100% auto';
  O.deskShadow=add(S.contactShadow(960,190));
  O.arc=B.pages.map(([k,label,path])=>{const o=add(miniWin(600,k+'_desktop',path));o._label=label;return o;});
  O.proofCard=add(card(1240,'mfa_proof'));
  O.clients=B.clients.map(c=>add(S.text3(c,28,'sub')));
  O.endCta=add(S.text3(`<span class="endcta">${B.cta}</span>`,1));
  O.endUrl=add(S.text3(`<span class="endurl">${B.url}</span>`,1));
  O.endFoot=add(S.text3('support@the-shift.ai&nbsp;&nbsp;·&nbsp;&nbsp;12 rue de la Part-Dieu, 69003 Lyon',20,'sub'));
  O.endProd=add(S.text3(B.products.join('&nbsp;&nbsp;·&nbsp;&nbsp;')+'&nbsp;&nbsp;·&nbsp;&nbsp;'+B.services.slice(0,3).join('&nbsp;&nbsp;·&nbsp;&nbsp;'),22,'sub'));
  return O;
}
export const objects=()=>O;
export const registry=()=>reg;
function hideAll(){reg.forEach(hide); cursorHide(); captionHide();}
function shotOp(o,id,v){ if(o._shots&&o._shots[id]) o._shots[id].style.opacity=v; }
/* Coupe franche stricte : aucun fondu en bord de plan. La transition est portee par le
 * mouvement de camera et par les rampes d'entree PROPRES a chaque objet, jamais par l'opacite du plan. */
const gate=()=>1;

/* ================= PLANS ================= */
function coldOpen(t,g){
  const m=M.cold, lt=t-m.t0, G=gate();
  const k=E.outQuint(clamp(inv(.15,2.1,lt)));
  const L=O.logo;
  L._mask.style.height=(lerp(.30,1,E.outQuint(clamp(inv(0,1.8,lt))))*(L._img.offsetHeight||248)+2)+'px';
  L._mask.style.width=(L._img.offsetWidth||620)+'px';
  L._eb.style.opacity=(G*E.outQuint(clamp(inv(1.3,2.4,lt)))).toFixed(3);
  L._eb.style.letterSpacing=lerp(.66,.34,E.outExpo(clamp(inv(1.3,2.8,lt)))).toFixed(3)+'em';
  place(L,{x:0,y:-74,z:lerp(-300,-30,k),s:lerp(.88,1,k),o:G,rz:lerp(-2.4,0,k)});
  place(O.coldRule,{x:0,y:168,z:lerp(-200,-20,k),o:E.outQuint(clamp(inv(1.5,2.5,lt)))*.9,
    s:lerp(.3,1,E.outExpo(clamp(inv(1.5,3.0,lt))))});
  place(O.coldLine,{x:0,y:224,z:lerp(-200,-20,k),o:E.outQuint(clamp(inv(2.0,3.1,lt)))*.85});
  applyCam({x:0,y:0,z:0,rx:lerp(5.5,0,E.inOutQuint(clamp(inv(0,3.6,lt)))),ry:0,dof:0});
  g.dustFlow=lerp(2.6,.4,E.outExpo(clamp(inv(0,2.8,lt))));
  g.gridK=.3+.32*E.out(clamp(inv(.3,3.2,lt)));
}
function heroReveal(t,g){
  const m=M.hero, lt=t-m.t0, G=gate();
  const k=E.outQuint(clamp(inv(0,2.7,lt))), k2=E.inOutQuint(clamp(inv(.3,5.6,lt)));
  shotOp(O.win,'home',1); shotOp(O.win,'mfa',0); shotOp(O.win,'produits',0);
  O.win._path.textContent='';
  const zEnd=zfit(1280,844,.80,.74), zStart=zEnd-620;
  const z=lerp(zStart,zEnd,k), y=lerp(172,-48,k);
  place(O.win,{x:lerp(-30,-6,k2),y,z,rx:lerp(12,4.6,k2),ry:lerp(-25,-10.5,k2),o:G,s:1});
  place(O.winShadow,{x:22,y:y+405,z:z-90,o:G*lerp(.08,.44,k),s:lerp(.72,1,k)});
  O.win._glare.style.opacity=(.5*(1-k2)+.1).toFixed(3);
  O.win._glare.style.transform=`translateX(${lerp(-48,44,k2).toFixed(1)}%)`;
  applyCam({x:0,y:lerp(-26,0,k2),z:0,rx:lerp(2.6,0,k2),ry:lerp(5,0,k2),dof:0});
  g.gridK=.6; g.dustFlow=.4;
  caption(t,{eyebrow:'Page d’accueil, capturée le 24/09',text:'',t0:m.t0+1.4,t1:m.t1-.3});
}
function promise(t,g){
  const m=M.promise, lt=t-m.t0, G=gate();
  const k=E.inOutQuint(clamp(inv(.15,4.8,lt)));
  const hh=1340*ar('home_hero');
  const zEnd=zfit(1340,hh,.78,.74), zStart=zEnd-420;
  place(O.hero,{x:lerp(70,-10,k),y:lerp(30,-52,k),z:lerp(zStart,zEnd,k),
    rx:lerp(9,4.2,k),ry:lerp(16,9.5,k),o:G,s:1});
  place(O.winShadow,{x:0,y:lerp(470,430,k),z:lerp(zStart-140,zEnd-160,k),o:G*.3,s:.9});
  applyCam({x:lerp(-46,26,k),y:lerp(22,-12,k),z:0,rx:lerp(-1.6,1,k),ry:lerp(-3,1.4,k),dof:0});
  g.gridK=.5;
  caption(t,{eyebrow:'La promesse, dans ses mots',text:'',t0:m.t0+1.1,t1:m.t1-.3});
}
function stats(t,g){
  const m=M.stats, lt=t-m.t0, G=gate();
  const travel=E.inOutQuint(clamp(inv(.2,6.0,lt)))*.55;
  O.stats.forEach((s,i)=>{
    const d=i*.075, kk=clamp(inv(d,d+1.2,lt)), k=E.outQuint(kk);
    const x=(i-1.5)*412 + lerp(24,-24,travel)*(1+i*.1);
    place(s,{x,y:lerp(70,-58,k),z:lerp(-260,-30-i*12,k),
      rx:lerp(13,2.4,k),ry:lerp(-13,(i-1.5)*3.2,k),o:G,s:lerp(.9,1,E.spring(kk))});
    const c0=d;
    s._v.textContent=count(lt,c0,c0+1.05,Math.round(s._spec.v*.34),s._spec.v)+s._spec.suf;
    s._bar.style.width=(lerp(22,100,E.outExpo(clamp(inv(c0,c0+1.3,lt))))).toFixed(1)+'%';
  });
  place(O.statsSrc,{x:lerp(26,-26,travel),y:160,z:-20,o:G*seg(t,m.t0+1.7,m.t0+2.6)*.75});
  applyCam({x:lerp(-72,72,travel),y:lerp(14,-10,travel),z:0,ry:lerp(-2.8,2.8,travel),rx:.8,dof:0});
  g.gridK=.45;
  caption(t,{eyebrow:'Les chiffres cités sur la page',text:'',t0:m.t0+1.9,t1:m.t1-.3});
}
function exploded(t,g){
  const m=M.exploded, lt=t-m.t0, G=gate();
  const openK=E.outQuint(clamp(inv(.25,2.1,lt)));
  const closeK=E.spring(clamp(inv(6.0,7.3,lt)),2.4,5.0);
  const sep=lerp(.24,1,openK)*(1-clamp(closeK)*.68)+.24*clamp(closeK);
  const orbit=E.inOutQuint(clamp(inv(.3,5.4,lt)));
  const N=O.layers.length;
  // L'echelle perspective ecrase les ecarts : une bande eloignee est plus petite ET plus
  // resserree. On construit donc la pile pour que l'ecart PROJETE soit constant (GAP px),
  // en divisant chaque position par l'echelle de sa propre profondeur. Une bande de 104 px
  // projetee au plus a 1,33 fait 138 px : GAP=158 garantit qu'aucune ne peut en couper une autre.
  const zc=zfit(860,900,.50,.80), GAP=166, DZ=104;
  const sc=z=>P/(P-z);
  let acc=-((N-1)*GAP)/2; const ys=[];
  for(let i=0;i<N;i++){ const c=i-(N-1)/2, z=zc+c*DZ*sep;
    if(i>0) acc+=GAP;
    ys.push(acc/sc(z)); }
  O.layers.forEach((L,i)=>{
    const c=i-(N-1)/2, z=zc+c*DZ*sep, x=c*46*sep;
    place(L,{x,y:ys[i]-26,z,rx:lerp(3,11,sep),ry:lerp(0,-3,sep),o:G,s:1,
      blur:Math.abs(c*DZ*sep)*.004});
    L._tag.style.opacity=(G*E.out(clamp(inv(.12+i*.045,.72+i*.045,lt)))*(1-clamp(closeK)*.85)).toFixed(3);
  });
  applyCam({x:lerp(-18,30,orbit),y:lerp(-4,12,orbit),z:0,ry:lerp(-14,15,orbit),rx:lerp(-2,4.5,orbit),dof:0});
  g.gridK=.55;
  caption(t,{eyebrow:'Anatomie de la page d’accueil',text:'Une page, six couches.',t0:m.t0+1.1,t1:m.t1-.6});
}

function services(t,g){
  const m=M.services, lt=t-m.t0, G=gate();
  const k=E.inOutQuint(clamp(inv(.15,5.3,lt)));
  const hh=1180*ar('tab_Chatbot');
  const zEnd=zfit(1180,hh,.80,.74), zStart=zEnd-330;
  const click1=1.9, click2=3.9;
  const sw1=E.out(clamp(inv(click1+.04,click1+.17,lt)));
  const sw2=E.out(clamp(inv(click2+.04,click2+.17,lt)));
  const base={x:lerp(-24,6,k),y:lerp(34,-46,k),z:lerp(zStart,zEnd,k),rx:lerp(8,3.8,k),ry:lerp(-13,-8,k)};
  place(O.tabA,{...base,o:G*(1-sw1)});
  place(O.tabB,{...base,o:G*sw1*(1-sw2)});
  place(O.tabC,{...base,o:G*sw2});
  applyCam({x:lerp(-26,18,k),y:0,z:0,ry:lerp(2.6,-1.8,k),rx:.6,dof:0});
  if(lt>.4&&lt<5.85){
    if(lt<click1+.42) cursorMove(lt,{from:O.hsStart,to:O.hsEmail,t0:.45,t1:click1,click:click1});
    else cursorMove(lt,{from:O.hsEmail,to:O.hsVeille,t0:click1+.42,t1:click2,click:click2,fade:.06});
  } else cursorHide();
  g.gridK=.42;
  caption(t,{eyebrow:'Sélection d’un module',text:'',t0:m.t0+.4,t1:m.t1-.3});
}
function donna(t,g){
  const m=M.donna, lt=t-m.t0, G=gate();
  const k=E.inOutQuint(clamp(inv(0,5.0,lt)));
  const scrollK=E.inOutQuint(clamp(inv(.8,4.2,lt)));
  const full=1180*ar('donna_scroll'), view=740;
  // section « En profondeur » a 20,97 % de la page : le defilement s'y arrete net
  const maxS=Math.min(full-view, 0.2097*9767*(3403/3500)*(full/3403));
  O.donna._shots.s.style.height=full+'px';
  O.donna._shots.s.style.transform=`translateY(${(-scrollK*maxS).toFixed(1)}px)`;
  const zEnd=zfit(1180,782,.78,.74), zStart=zEnd-300;
  place(O.donna,{x:lerp(-90,30,k),y:lerp(10,-52,k),z:lerp(zStart,zEnd,k),rx:lerp(7,3.6,k),ry:lerp(16,8.5,k),o:G});
  place(O.winShadow,{x:lerp(-80,40,k),y:lerp(420,380,k),z:lerp(zStart-140,zEnd-150,k),o:G*.36,s:.9});
  applyCam({x:lerp(40,-22,k),y:lerp(-6,8,k),z:0,ry:lerp(-4,2.4,k),rx:1.2,dof:0});
  cursorHide(); g.gridK=.38;
  caption(t,{eyebrow:'Page produit, défilement réel',text:'',t0:m.t0+.4,t1:m.t1-.3});
}
function calc(t,g){
  const m=M.calc, lt=t-m.t0, G=gate();
  const k=E.inOutQuint(clamp(inv(0,4.8,lt)));
  const hh=1150*ar('calc_before');
  const zEnd=zfit(1150,hh,.82,.72), zStart=zEnd-460;
  const drag0=1.2, drag1=2.75;
  const sw=lt>=drag1-.12?1:0;
  const base={x:lerp(-16,10,k),y:lerp(20,-56,k),z:lerp(zStart,zEnd,k),rx:lerp(8,3.6,k),ry:lerp(-12,-8,k)};
  place(O.calcA,{...base,o:G*(1-sw)});
  place(O.calcB,{...base,o:G*sw});
  applyCam({x:lerp(20,-14,k),y:lerp(16,-8,k),z:0,ry:lerp(2.4,-1.6,k),rx:1,dof:0});
  if(lt>.3&&lt<drag0) cursorMove(lt,{from:O.hsCalcStart,to:O.hsSlid0,t0:.35,t1:drag0,click:drag0});
  else if(lt>=drag0&&lt<4.8) cursorMove(lt,{from:O.hsSlid0,to:O.hsSlid1,t0:drag0,t1:drag1,click:drag0,fade:.05});
  else cursorHide();
  g.gridK=.42;
  caption(t,{eyebrow:'Calculateur du site, curseurs déplacés',text:'',t0:m.t0+1.25,t1:m.t1-.3});
}
function devices(t,g){
  const m=M.devices, lt=t-m.t0, G=gate();
  const k=E.inOutQuint(clamp(inv(0,4.0,lt)));
  const en=i=>E.outQuint(clamp(inv(.06+i*.13,1.35+i*.13,lt)));
  shotOp(O.win,'home',1); shotOp(O.win,'mfa',0); shotOp(O.win,'produits',0);
  O.win._path.textContent='';
  place(O.win,{x:lerp(48,92,k)+(1-en(0))*54,y:lerp(-90,-108,k)+(1-en(0))*30,z:lerp(-430,-380,k)-(1-en(0))*90,rx:3.4,ry:lerp(15,11,k),o:G,s:1});
  place(O.laptop,{x:lerp(486,502,k)+(1-en(1))*46,y:lerp(96,78,k)+(1-en(1))*34,z:lerp(-160,-120,k)-(1-en(1))*90,rx:lerp(6,4,k),ry:lerp(-19,-14,k),o:G,s:1});
  const ph=310*ar('home_mobscroll');
  O.phone._screen.style.height=ph+'px';
  O.phone._screen.style.transform='translateY(0px)';   // hero fixe : aucun titre ne peut etre tranche
  place(O.phone,{x:lerp(-470,-448,k)-(1-en(2))*46,y:lerp(46,28,k)+(1-en(2))*34,z:lerp(20,70,k)-(1-en(2))*90,rx:lerp(4,3,k),ry:lerp(21,15,k),o:G,s:1});
  place(O.deskShadow,{x:496,y:356,z:-210,o:G*.3});
  applyCam({x:lerp(96,20,k),y:lerp(-16,6,k),z:0,ry:lerp(-5.5,3.5,k),rx:lerp(-1,2,k),dof:0});
  cursorHide(); g.gridK=.5;
  caption(t,{eyebrow:'Desktop, portable, mobile',text:'Une marque, trois écrans.',t0:m.t0+.5,t1:m.t1-.3});
}
function carousel(t,g){
  const m=M.carousel, lt=t-m.t0, G=gate();
  const sweep=E.inOutQuint(clamp(inv(.05,3.9,lt)));
  // rail : pas de 740 px pour des fenetres de 600 projetees a 600 x cos(19 deg) = 567 -> jamais de recouvrement
  const N=O.arc.length, STEP=740, base=zfit(600,600*ar('home_desktop')+34,.36,.56);
  const camX=lerp(-(N-1)/2*STEP-40, (N-1)/2*STEP+40, sweep);
  O.arc.forEach((w,i)=>{
    const x=(i-(N-1)/2)*STEP;
    const en=E.outQuint(clamp(inv(.02+i*.04,.9+i*.04,lt)));
    const dx=(x-camX)/STEP;                         // distance a l'axe de la camera, en pas de rail
    place(w,{x,y:-22+Math.sin(i*1.35)*26,z:base+Math.cos(i*.9)*70-(1-en)*150,
      ry:-19,rx:2.2,o:G,s:1,blur:Math.min(2.6,Math.abs(dx)*Math.abs(dx)*.55)});
  });
  applyCam({x:camX,y:lerp(-10,6,sweep),z:0,ry:lerp(2.6,-2.6,sweep),rx:lerp(1.2,-.6,sweep),dof:0});
  cursorHide(); g.gridK=.6;
  caption(t,{eyebrow:'Le site en entier',text:'Quinze pages, une identité.',t0:m.t0+.4,t1:m.t1-.3});
}
function proof(t,g){
  const m=M.proof, lt=t-m.t0, G=gate();
  const k=E.inOutQuint(clamp(inv(0,3.8,lt)));
  const hh=1240*ar('mfa_proof');
  const zEnd=zfit(1240,hh,.80,.66), zStart=zEnd-240;
  place(O.proofCard,{x:lerp(-16,8,k),y:lerp(-92,-118,k),z:lerp(zStart,zEnd,k),rx:lerp(8,4,k),ry:lerp(-13,-8.5,k),o:G});
  place(O.winShadow,{x:0,y:lerp(300,272,k),z:lerp(zStart-140,zEnd-150,k),o:G*.34,s:.92});
  O.clients.forEach((c,i)=>{
    const d=.7+i*.11, kk=E.outQuint(clamp(inv(d,d+.8,lt)));
    place(c,{x:(i-2)*318,y:lerp(322,306,k),z:lerp(-60,-20,k),ry:lerp(-4,1.5,k),o:G*kk*.72,s:lerp(.92,1,kk)});
  });
  applyCam({x:lerp(14,-8,k),y:lerp(16,-10,k),z:0,ry:lerp(1.8,-1.2,k),rx:lerp(-.8,1.6,k),dof:0});
  cursorHide(); g.gridK=.5;
  caption(t,{eyebrow:'Référence en production',text:'',t0:m.t0+.4,t1:m.t1-.3});
}
function endcard(t,g){
  const m=M.end, lt=t-m.t0;
  const G=1;
  const k=E.outQuint(clamp(inv(0,2.6,lt)));
  const L=O.logo;
  L._mask.style.height='auto'; L._mask.style.width='auto';
  L._eb.style.opacity=(G*E.outQuint(clamp(inv(.4,1.4,lt)))).toFixed(3);
  L._eb.style.letterSpacing='.34em';
  place(L,{x:0,y:lerp(-214,-200,k),z:lerp(-140,-20,k),o:G,s:lerp(.92,1,k)});
  place(O.endCta,{x:0,y:lerp(136,114,E.spring(clamp(inv(.6,1.9,lt)),2.4,5)),z:lerp(-60,20,k),
    o:G*E.outQuint(clamp(inv(.1,1.0,lt)))});
  place(O.endUrl,{x:0,y:lerp(236,218,k),z:lerp(-60,20,k),o:G*E.outQuint(clamp(inv(.3,1.3,lt)))*.9});
  place(O.endProd,{x:0,y:lerp(8,-2,k),z:lerp(-60,20,k),o:G*E.outQuint(clamp(inv(.5,1.5,lt)))*.62});
  place(O.endFoot,{x:0,y:lerp(318,304,k),z:lerp(-60,20,k),o:G*E.outQuint(clamp(inv(.75,1.7,lt)))*.5});
  applyCam({x:0,y:0,z:0,rx:0,ry:0,dof:0});
  g.dustFlow=lerp(.4,1.7,E.in(clamp(inv(1.0,3.6,lt))));
  g.gridK=lerp(.5,.36,E.inOut(clamp(inv(1.0,3.4,lt))));
}
const FN={cold:coldOpen,hero:heroReveal,promise,stats,exploded,services,donna,calc,devices,carousel,proof,end:endcard};

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
    x.beginPath(); x.arc(px,py,p.r*(1+flow*.2),0,6.2832);
    x.fillStyle=`rgba(37,99,235,${(p.a*(.3+flow*.28)).toFixed(3)})`; x.fill();
  }
}
/** Un seul plan est rendu a la fois : les coupes sont franches, portees par le mouvement. */
export function render(t){
  t=Math.max(0,Math.min(TOTAL-1e-4,t));
  hideAll();
  const glob=Math.min(E.out(clamp(inv(0,.22,t))),1-E.in(clamp(inv(TOTAL-.55,TOTAL,t))));
  document.getElementById('camera').style.opacity=glob.toFixed(3);
  document.getElementById('overlay').style.opacity=glob.toFixed(3);
  const g={};
  const cur=MARKS.find(m=>t>=m.t0&&t<m.t1)||MARKS[MARKS.length-1];
  FN[cur.id](t,g);
  bg(t,g);
  const p=document.querySelector('#progress i'); if(p) p.style.width=(t/TOTAL*100).toFixed(2)+'%';
}
