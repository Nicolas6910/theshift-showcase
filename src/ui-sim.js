import {clamp,lerp,E,inv,seg} from './utils.js';
const cur=()=>document.getElementById('cursor');
const rip=()=>cur().querySelector('.ripple');

// courbe de Bezier cubique : le curseur n'avance jamais en ligne droite
export function bez(p0,p1,p2,p3,t){
  const u=1-t,a=u*u*u,b=3*u*u*t,c=3*u*t*t,d=t*t*t;
  return [a*p0[0]+b*p1[0]+c*p2[0]+d*p3[0], a*p0[1]+b*p1[1]+c*p2[1]+d*p3[1]];
}
/** Deplace le curseur de `from` vers `to` entre t0 et t1, clic a tClick. */
export function cursorMove(t,{from,to,t0,t1,click,fade=.25}){
  const c=cur(), k=clamp(inv(t0,t1,t));
  const e=E.inOutQuint(k);
  const c1=[lerp(from[0],to[0],.28)+ (to[1]-from[1])*.16, lerp(from[1],to[1],.1)-64];
  const c2=[lerp(from[0],to[0],.74)- (to[1]-from[1])*.1, lerp(from[1],to[1],.92)+34];
  const [x,y]=bez(from,c1,c2,to,e);
  const app=Math.min(inv(t0-fade,t0+fade*.6,t), 1);
  let press=0;
  if(click!=null){ const d=t-click; if(d>-.02&&d<.34) press=Math.sin(clamp(d/.34)*Math.PI); }
  c.style.opacity=app.toFixed(3);
  c.style.visibility=app<=.004?'hidden':'visible';
  c.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${(1-press*.2).toFixed(3)})`;
  if(click!=null){ const d=(t-click)/.62;
    if(d>=0&&d<=1){ rip().style.opacity=(1-E.out(d)).toFixed(3); rip().style.transform=`scale(${(1+E.outExpo(d)*4.6).toFixed(3)})`; }
    else rip().style.opacity=0;
  } else rip().style.opacity=0;
  return {x,y,press,progress:e};
}
export function cursorHide(){const c=cur();c.style.opacity=0;c.style.visibility='hidden';}

/** Bouton qui s'enfonce : renvoie l'echelle a appliquer. */
export function pressScale(t,click,amp=.04){
  if(click==null)return 1; const d=t-click;
  if(d<0||d>.4)return 1;
  return 1-amp*Math.sin(clamp(d/.4)*Math.PI);
}
/** Compteur : monte de a vers b, easing expo, formate. */
export function count(t,t0,t1,a,b,fmt=v=>Math.round(v)){
  return fmt(lerp(a,b,E.outExpo(clamp(inv(t0,t1,t)))));
}
/** Sous-titre : eyebrow + ligne, avec entree/sortie decalees. */
export function caption(t,{eyebrow,text,t0,t1,dur=.62}){
  const eb=document.getElementById('cap-eyebrow'), tx=document.getElementById('cap-text');
  const inK=E.outQuint(clamp(inv(t0,t0+dur,t))), outK=E.in(clamp(inv(t1-.42,t1,t)));
  const inK2=E.outQuint(clamp(inv(t0+.12,t0+.12+dur,t)));
  const a=clamp(inK-outK), a2=clamp(inK2-outK);
  eb.textContent=eyebrow||''; tx.innerHTML=text||'';
  eb.style.opacity=a; eb.style.transform=`translateY(${((1-inK)*16).toFixed(2)}px)`;
  tx.style.opacity=a2; tx.style.transform=`translateY(${((1-inK2)*24).toFixed(2)}px)`;
}
export function captionHide(){
  document.getElementById('cap-eyebrow').style.opacity=0;
  document.getElementById('cap-text').style.opacity=0;
}
