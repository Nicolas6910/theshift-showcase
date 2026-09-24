import B from './brand.js';
export const A='assets/';
const el=(t,c,p)=>{const e=document.createElement(t);if(c)e.className=c;if(p)p.appendChild(e);return e;};

export function browserWindow(w,h,url,shots){
  const o=el('div','obj win'); o._w=w; o._h=h;
  o.style.width=w+'px'; o.style.height=h+'px'; o.style.display='flex'; o.style.flexDirection='column';
  const ch=el('div','chrome',o);
  const d=el('div','dots',ch); el('i',null,d); el('i',null,d); el('i',null,d);
  const ad=el('div','addr',ch);
  const fav=el('img',null,ad); fav.src=A+'favicon.png'; fav.alt='';
  el('span','lock',ad);
  ad.insertAdjacentHTML('beforeend',`<span>https://</span><b>${url}</b><span id="addrpath"></span>`);
  o._path=ad.querySelector('#addrpath'); o._path.removeAttribute('id');
  const body=el('div','winbody',o); o._body=body; o._blurTarget=body;
  o._shots={};
  (shots||[]).forEach((s,i)=>{const sc=el('div','shot',body);sc.style.backgroundImage=`url(${A}${s.file})`;
    sc.style.opacity=i===0?1:0; o._shots[s.id]=sc;});
  o._glare=el('div','glare',body);
  return o;
}
export function contactShadow(w,h){const s=el('div','obj contact');s._w=w;s._h=h;s.style.width=w+'px';s.style.height=h+'px';return s;}

export function laptop(w,img){
  const o=el('div','obj'); const sh=Math.round(w*0.625);
  o._w=w; o._h=sh+22; o.style.width=w+'px';
  const sc=el('div','laptop-screen',o); sc.style.height=sh+'px'; sc.style.position='relative';
  const im=el('div','shot',sc); im.style.backgroundImage=`url(${A}${img})`; o._screen=im;
  el('div','laptop-notch',sc);
  const base=el('div','laptop-base',o); base.style.height='16px'; base.style.width=(w*1.1)+'px';
  base.style.marginLeft=(-w*0.05)+'px';
  return o;
}
export function phone(w,img){
  const h=Math.round(w*2.164);
  const o=el('div','obj phone'); o._w=w; o._h=h; o.style.width=w+'px'; o.style.height=h+'px';
  const inn=el('div','phone-inner',o); el('div','notch',inn);
  const im=el('div','shot',inn); im.style.backgroundImage=`url(${A}${img})`;
  im.style.top='48px';                      // zone de securite : le contenu ne passe jamais sous l'encoche
  o._screen=im; o._safe=48;
  return o;
}
export function imgLayer(w,img,tag,cls){
  const o=el('div','obj '+(cls||'layer')); o._w=w; o.style.width=w+'px';
  const im=el('div',null,o); im.style.width='100%'; im.style.backgroundImage=`url(${A}${img})`;
  im.style.backgroundSize='100% auto'; im.style.backgroundRepeat='no-repeat'; o._im=im; o._blurTarget=im;
  if(tag){const tg=el('div','tag',o); tg.textContent=tag;}
  return o;
}
export function statCard(s){
  const o=el('div','obj stat'); o._w=360; o._h=300;
  const v=el('div','v',o); v.textContent='0'+s.suf; o._v=v; o._spec=s;
  const bar=el('div','bar',o); o._bar=bar;
  const l=el('div','l',o); l.textContent=s.l;
  return o;
}
export function text3(txt,size,cls){
  const o=el('div','obj t3 '+(cls||'')); o.style.fontSize=size+'px'; o.innerHTML=txt;
  o._w=0; o._h=0; o._ctr=true; o.style.transformOrigin='50% 50%';
  return o;
}
export function chip(txt){const o=el('div','obj');o.innerHTML=`<span class="chip">${txt}</span>`;o._w=0;o._h=0;o._ctr=true;return o;}
export function logoBlock(){
  const o=el('div','obj logoblock'); o._w=0; o._h=0; o._ctr=true;
  const m=el('div','logomask',o); const im=el('img',null,m); im.src=A+'logo.png'; im.alt='the-shift.ai';
  o._mask=m; o._img=im;
  const eb=el('div','eyebrow',o); eb.textContent=B.eyebrow; o._eb=eb;
  return o;
}
export function measure(o){if(o._ctr)return o;o._w=o.offsetWidth;o._h=o.offsetHeight;return o;}

/** Ancre invisible a une position relative (fx,fy) d'une carte : sert de cible au curseur.
 *  Sa position ecran est lue apres transform 3D, donc elle reste exacte quelle que soit la camera. */
export function hotspot(parent,fx,fy){
  const h=el('div',null,parent);
  h.style.cssText=`position:absolute;left:${(fx*100).toFixed(3)}%;top:${(fy*100).toFixed(3)}%;width:0;height:0;pointer-events:none`;
  return h;
}
