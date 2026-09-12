import { lab } from './level.js';
import { createWorld,reset,step,DT,PHYSICS_VERSION } from './physics.js';
import { createRenderer } from './render.js';
const $=id=>document.getElementById(id),canvas=$('game'),world=createWorld(lab),render=createRenderer(canvas);
const keys=new Set();let jumpPressed=false,jumpReleased=false,paused=false,debug=false,accumulator=0,last=0,deathDelay=0,cameraReset=true;
let best=null,soundContext=null,storageAvailable=true,feedbackUntil=0;
const saveKey=`send-it:pb:${PHYSICS_VERSION}:${lab.id}:${lab.version}`;
try{const value=JSON.parse(localStorage.getItem(saveKey));if(typeof value==='number'&&Number.isFinite(value)&&value>0)best=value;}catch{storageAvailable=false;}
const format=s=>`${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toFixed(3).padStart(6,'0')}`;
$('best').textContent=best?format(best):'—';
$('reduced-motion').checked=matchMedia('(prefers-reduced-motion: reduce)').matches;
function pause(value){paused=value;keys.clear();jumpPressed=false;jumpReleased=false;accumulator=0;$('paused').hidden=!value;}
function restart(station=-1){reset(world,station);deathDelay=0;accumulator=0;jumpPressed=false;jumpReleased=false;cameraReset=true;$('overlay').hidden=true;pause(false);canvas.focus();}
function sound(event){if(!$('sound').checked)return;try{soundContext??=new AudioContext();soundContext.resume();const o=soundContext.createOscillator(),g=soundContext.createGain();o.connect(g);g.connect(soundContext.destination);const t=soundContext.currentTime,f={jump:310,land:100,pickup:720,death:70,complete:960}[event]||200;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.6,t+.1);g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.start(t);o.stop(t+.13);}catch{}}
function completed(){
  const t=world.time,targets=lab.targets,rank=t<=targets.unhinged?'UNHINGED':t<=targets.sendIt?'SEND IT':t<=targets.express?'EXPRESS':'DELIVERED';
  const pb=!world.practice&&(best===null||t<best);
  if(pb){best=t;try{localStorage.setItem(saveKey,JSON.stringify(best));}catch{storageAvailable=false;}$('best').textContent=format(best);}
  $('result-label').textContent=world.practice?'PRACTICE DELIVERY':rank;$('result-time').textContent=format(t);
  $('result-detail').textContent=`${pb?'New personal best. ':''}${world.practice?'Practice run — no record saved.':`Express ${targets.express}s · Send It ${targets.sendIt}s`}${storageAvailable?'':' Storage unavailable; record lasts this session.'}`;
  $('overlay').hidden=false;
}
const gameKeys=['KeyA','KeyD','KeyS','ArrowLeft','ArrowRight','ArrowDown','Space','KeyR','Escape','F2','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7'];
window.addEventListener('keydown',e=>{
  if(e.target instanceof HTMLInputElement||e.target instanceof HTMLButtonElement)return;
  if(!gameKeys.includes(e.code))return;e.preventDefault();
  if(e.repeat)return;
  if(e.code==='KeyR'){restart();return;}
  if(e.code==='Escape'){pause(!paused);return;}
  if(e.code==='F2'){debug=!debug;return;}
  if(e.code.startsWith('Digit')){restart(Number(e.code.slice(-1))-1);return;}
  if(paused)return;
  keys.add(e.code);if(e.code==='Space')jumpPressed=true;
});
window.addEventListener('keyup',e=>{keys.delete(e.code);if(e.code==='Space')jumpReleased=true;});
window.addEventListener('blur',()=>pause(true));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(true);});
canvas.addEventListener('pointerdown',()=>{pause(false);canvas.focus();});
$('restart').onclick=()=>restart();$('again').onclick=()=>restart();$('debug').onclick=()=>{debug=!debug;canvas.focus();};
function frame(now){
  const elapsed=last?Math.min((now-last)/1000,.1):0;last=now;
  if(!paused){
    accumulator+=elapsed;
    while(accumulator>=DT){
      if(world.status==='dead'){deathDelay+=DT;if(deathDelay>=.35)restart(world.station);}
      else{
        step(world,{left:keys.has('KeyA')||keys.has('ArrowLeft'),right:keys.has('KeyD')||keys.has('ArrowRight'),down:keys.has('KeyS')||keys.has('ArrowDown'),jumpPressed,jumpReleased});
        jumpPressed=false;jumpReleased=false;
        for(const event of world.events)sound(event);
        if(world.events.includes('death')){$('feedback').textContent=`Last attempt: ${world.failure.cause}. ${world.failure.hint}`;$('feedback').hidden=false;feedbackUntil=now+6500;}
        if(world.events.includes('complete'))completed();
      }
      accumulator=Math.max(0,accumulator-DT);
    }
  }
  render(world,{debug,reducedMotion:$('reduced-motion').checked,elapsed:paused?0:elapsed,resetCamera:cameraReset});cameraReset=false;
  $('time').textContent=format(world.time);$('speed').textContent=`${Math.round(Math.abs(world.p.vx))} px/s`;
  if(now>feedbackUntil)$('feedback').hidden=true;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
