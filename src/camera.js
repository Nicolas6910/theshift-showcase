import {lerp,E,inv} from './utils.js';
const world=()=>document.getElementById('world');
export const CAM={x:0,y:0,z:0,rx:0,ry:0,rz:0,focus:0,dof:0};
export function setCam(c){Object.assign(CAM,c);}
// interpolation eased entre deux etats de camera
export function camLerp(a,b,t,e=E.inOutQuint){
  const k=e(t),o={};
  for(const key of ['x','y','z','rx','ry','rz','focus','dof']) o[key]=lerp(a[key]||0,b[key]||0,k);
  return o;
}
export function applyCam(c){
  Object.assign(CAM,c);
  world().style.transform=
    `translate3d(0,0,${(c.z||0).toFixed(2)}px) rotateX(${(c.rx||0).toFixed(3)}deg) `+
    `rotateY(${(c.ry||0).toFixed(3)}deg) rotateZ(${(c.rz||0).toFixed(3)}deg) `+
    `translate3d(${(-(c.x||0)).toFixed(2)}px,${(-(c.y||0)).toFixed(2)}px,0)`;
}
// flou de profondeur de champ : distance au plan de mise au point
export function dof(objZ){
  if(!CAM.dof) return 0;
  return Math.min(9, Math.abs(objZ-(CAM.focus||0))*CAM.dof);
}
