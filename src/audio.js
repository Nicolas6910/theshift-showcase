// Piste synthetisee (Web Audio), calee sur les frontieres de plans. Aucun sample externe.
import {MARKS,TOTAL} from './shots.js';
const CUTS=MARKS.map(m=>m.t0).slice(1);
export function scheduleTrack(ac,dest,t0){
  const master=ac.createGain(); master.gain.value=.5; master.connect(dest);
  // nappe : deux oscillateurs desaccordes en La mineur, filtre passe-bas qui s'ouvre
  const pad=ac.createGain(); pad.gain.value=0; pad.connect(master);
  const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(320,t0);
  lp.frequency.linearRampToValueAtTime(1900,t0+TOTAL*.72); lp.connect(pad);
  [110,164.81,220,329.63].forEach((f,i)=>{
    const o=ac.createOscillator(); o.type=i<2?'sine':'triangle'; o.frequency.value=f;
    const g=ac.createGain(); g.gain.value=[.30,.18,.13,.07][i];
    o.connect(g); g.connect(lp); o.start(t0); o.stop(t0+TOTAL+1.2);
  });
  pad.gain.setValueAtTime(0,t0);
  pad.gain.linearRampToValueAtTime(.34,t0+2.4);
  pad.gain.setValueAtTime(.34,t0+TOTAL-3.2);
  pad.gain.linearRampToValueAtTime(0,t0+TOTAL);
  // impulsion sur chaque coupe
  for(const c of CUTS){
    const o=ac.createOscillator(), g=ac.createGain();
    o.type='sine'; o.frequency.setValueAtTime(180,t0+c); o.frequency.exponentialRampToValueAtTime(46,t0+c+.42);
    g.gain.setValueAtTime(0,t0+c); g.gain.linearRampToValueAtTime(.42,t0+c+.012);
    g.gain.exponentialRampToValueAtTime(.001,t0+c+.5);
    o.connect(g); g.connect(master); o.start(t0+c); o.stop(t0+c+.55);
  }
  // pulsation a 96 bpm sous les plans de demonstration
  for(let b=0;b*0.625<TOTAL;b++){
    const tt=t0+b*0.625; const lt=b*0.625;
    if(lt<4.0||lt>TOTAL-3.4) continue;
    const o=ac.createOscillator(), g=ac.createGain();
    o.type='sine'; o.frequency.value=b%4===0?96:72;
    g.gain.setValueAtTime(0,tt); g.gain.linearRampToValueAtTime(b%4===0?.15:.07,tt+.008);
    g.gain.exponentialRampToValueAtTime(.0008,tt+.2);
    o.connect(g); g.connect(master); o.start(tt); o.stop(tt+.24);
  }
  return master;
}
