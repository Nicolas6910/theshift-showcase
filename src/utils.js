export const clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v;
export const lerp=(a,b,t)=>a+(b-a)*t;
export const inv=(a,b,v)=>clamp((v-a)/(b-a||1e-6));
export const mix=(a,b,t)=>a.map((v,i)=>lerp(v,b[i],t));

// easings (aucune interpolation lineaire a l'ecran)
export const E={
  out:t=>1-Math.pow(1-t,3),
  outQuint:t=>1-Math.pow(1-t,5),
  outExpo:t=>t>=1?1:1-Math.pow(2,-10*t),
  inOut:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,
  inOutQuint:t=>t<.5?16*t*t*t*t*t:1-Math.pow(-2*t+2,5)/2,
  in:t=>t*t*t,
  // ressort amorti deterministe (overshoot puis retour)
  spring:(t,f=3.1,d=5.4)=>t>=1?1:1-Math.pow(2.718281828,-d*t)*Math.cos(f*Math.PI*t),
  back:(t,s=1.7)=>1+ (s+1)*Math.pow(t-1,3)+s*Math.pow(t-1,2),
};
// rampe eased entre deux temps
export const seg=(t,a,b,e=E.inOut)=>e(inv(a,b,t));
// fenetre : monte sur [a,b], tient, redescend sur [c,d]
export const win=(t,a,b,c,d,e=E.inOut)=>Math.min(e(inv(a,b,t)),1-e(inv(c,d,t)));

// aleatoire seede (mulberry32) : preview et export identiques
export function rng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)|0;let r=Math.imul(s^s>>>15,1|s);r=(r+Math.imul(r^r>>>7,61|r))^r;return((r^r>>>14)>>>0)/4294967296;};}

export function place(el,o={}){
  const ctr=el._ctr;
  const w=ctr?0:(o.w!=null?o.w:el._w||0), h=ctr?0:(o.h!=null?o.h:el._h||0);
  const parts=[`translate3d(${(o.x||0)-w/2}px,${(o.y||0)-h/2}px,${o.z||0}px)`];
  if(o.ry)parts.push(`rotateY(${o.ry}deg)`);
  if(o.rx)parts.push(`rotateX(${o.rx}deg)`);
  if(o.rz)parts.push(`rotateZ(${o.rz}deg)`);
  if(o.s!=null&&o.s!==1)parts.push(`scale(${o.s})`);
  if(ctr)parts.push('translate(-50%,-50%)');
  el.style.transform=parts.join(' ');
  if(o.o!=null){el.style.opacity=o.o; el.style.visibility=o.o<=0.002?'hidden':'visible';}
  if(o.blur!=null){const b=o.blur, tgt=el._blurTarget||el;
    tgt.style.filter=b>0.05?`blur(${b.toFixed(2)}px)`:'none';}
}
export const hide=el=>{el.style.opacity=0;el.style.visibility='hidden';};
export const px=n=>n.toFixed(2)+'px';
export function nfr(n,dec=0){ // format francais : 316 800
  return n.toLocaleString('fr-FR',{minimumFractionDigits:dec,maximumFractionDigits:dec}).replace(/ | /g,' ');
}
