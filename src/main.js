import {lab} from './level.js';
import {deliveries,medal,readProgress,recordDelivery,unlockedCount,progressKey} from './campaign.js';
import {createWorld,reset,step,DT,PHYSICS_VERSION} from './physics.js';
import {createRenderer} from './render.js';
import {drawCourier} from './art.js';
import {artReady} from './painted-art.js';
const $=id=>document.getElementById(id),canvas=$('game'),render=createRenderer(canvas),keys=new Set();
const portrait=$('courier-portrait').getContext('2d');
function drawPortrait(){
portrait.clearRect(0,0,220,180);
portrait.fillStyle='#d8e4d5';portrait.beginPath();portrait.ellipse(110,94,77,70,-.15,0,Math.PI*2);portrait.fill();
portrait.fillStyle='#29445528';portrait.beginPath();portrait.ellipse(112,155,47,8,0,0,Math.PI*2);portrait.fill();
portrait.save();portrait.translate(67,29);portrait.scale(3.7,3.7);drawCourier(portrait,{x:0,y:0,w:24,h:36,vx:0,vy:0,grounded:true,facing:1,state:'idle'},0,true);portrait.restore();
}
drawPortrait();artReady.then(drawPortrait);
let level=deliveries[0],world=createWorld(level),index=0,boardOpen=true;
let jumpPressed=false,jumpReleased=false,paused=true,debug=false,accumulator=0,last=0,deathDelay=0,cameraReset=true;
let best=null,soundContext=null,storageAvailable=true,feedbackUntil=0,attempts=0;
let storage;try{storage=localStorage;storage.getItem(progressKey);}catch{storageAvailable=false;}
const progress=readProgress(storage);
const format=s=>`${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toFixed(3).padStart(6,'0')}`;
const labKey=`send-it:pb:${PHYSICS_VERSION}:${lab.id}:${lab.version}`;
const replies=['“Still warm. You are a miracle.”','“You made it! We close in literally one second.”','“Perfect. Now we can stop the conveyor.”','“Could you water the plants on your way down?”','“Actually, could you put it upstairs? Kidding.”','“Thank you! My phone was at one percent.”'];
$('reduced-motion').checked=matchMedia('(prefers-reduced-motion: reduce)').matches;
function clearInput(){keys.clear();jumpPressed=false;jumpReleased=false;accumulator=0;}
function pause(value){paused=value;clearInput();$('paused').hidden=!value||boardOpen||world.status==='complete';}
function board(){boardOpen=true;pause(true);$('dispatch').hidden=false;$('overlay').hidden=true;drawBoard();$('continue').focus();window.scrollTo({top:0,behavior:'instant'});}
function drawBoard(){
  const count=Object.keys(progress.records).length,unlocked=unlockedCount(progress);
  $('shift-progress').textContent=`${count} / ${deliveries.length} delivered`;
  $('continue').textContent=count===deliveries.length?'Replay your shift ↗':count?'Continue your shift ↗':'Start your shift ↗';
  $('jobs').replaceChildren();
  deliveries.forEach((l,i)=>{
    const b=document.createElement('button');b.className='job'+(progress.records[l.id]?' delivered':'');b.disabled=i>=unlocked;
    const label=document.createElement('span');label.className='eyebrow';label.textContent=`0${i+1} / ${l.district}`;
    const title=document.createElement('strong');title.textContent=l.name;
    const detail=document.createElement('span');detail.className='job-status';const t=progress.records[l.id];
    detail.textContent=t?`${medal(t,l.targets)} · ${format(t)}`:i>=unlocked?'Complete the previous delivery to unlock':'Ready for dispatch ↗';
    b.append(label,title,detail);b.onclick=()=>select(i);$('jobs').append(b);
  });
}
function select(i){
  if(i>=unlockedCount(progress))return;
  index=i;level=i<0?lab:deliveries[i];world=createWorld(level);attempts=0;best=i<0?null:progress.records[level.id]||null;
  if(i<0){try{const t=JSON.parse(storage?.getItem(labKey));if(Number.isFinite(t)&&t>0)best=t;}catch{}}
  $('mission-name').textContent=level.name||'The proving ground';$('dispatch-number').textContent=i<0?'MOVEMENT PLAYGROUND':`DISPATCH 00${i+1}`;
  $('mission-district').textContent=level.district||'TRAINING';$('brief').textContent=level.brief||'Experiment freely. Number keys 1–8 select practice stations.';
  $('best').textContent=best?format(best):'—';boardOpen=false;$('dispatch').hidden=true;$('feedback').hidden=true;feedbackUntil=0;restart();
  canvas.scrollIntoView({block:'center',behavior:'instant'});
}
function restart(station=-1){reset(world,station);deathDelay=0;clearInput();cameraReset=true;$('overlay').hidden=true;pause(false);canvas.focus({preventScroll:true});}
function sound(event){if(!$('sound').checked)return;try{soundContext??=new AudioContext();soundContext.resume();const o=soundContext.createOscillator(),g=soundContext.createGain();o.connect(g);g.connect(soundContext.destination);const t=soundContext.currentTime,f={jump:310,land:100,pickup:720,death:70,complete:960}[event]||200;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.6,t+.1);g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.start(t);o.stop(t+.13);}catch{}}
function completed(){
  const t=world.time,targets=level.targets,pb=!world.practice&&(best===null||t<best);
  if(pb){best=t;
    try{if(index<0){if(!storage)throw Error();storage.setItem(labKey,JSON.stringify(best));}else{recordDelivery(progress,level,t);if(!storage)throw Error();storage.setItem(progressKey,JSON.stringify(progress));}}catch{storageAvailable=false;}
    $('best').textContent=format(best);
  }
  $('result-label').textContent=world.practice?'PRACTICE DELIVERY':medal(t,targets);$('result-time').textContent=format(t);
  $('result-detail').textContent=`${pb?'New personal best! ':''}${world.practice?'Practice — no record saved.':`Express ${targets.express}s · Send It ${targets.sendIt}s · Unhinged ${targets.unhinged}s. ${attempts} retries.`}${storageAvailable?'':' Storage unavailable; progress lasts this session.'}`;
  $('recipient').textContent=index<0?'Training complete. Take it to the city.':replies[index];
  $('next').textContent=index===deliveries.length-1?'Shift complete — dispatch board':index<0?'Start your shift ↗':'Next delivery ↗';
  $('overlay').hidden=false;clearInput();$('next').focus({preventScroll:true});drawBoard();
}
const gameKeys=['KeyA','KeyD','KeyS','ArrowLeft','ArrowRight','ArrowDown','Space','KeyR','Escape','F2','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8'];
window.addEventListener('keydown',e=>{
  if(e.code==='Escape'&&boardOpen){if(e.target instanceof HTMLInputElement)return;select(index);return;}
  if(e.code==='KeyR'&&!boardOpen){e.preventDefault();if(!e.repeat){attempts++;restart();}return;}
  if(e.target instanceof HTMLInputElement||e.target instanceof HTMLButtonElement)return;
  if(!gameKeys.includes(e.code)||boardOpen)return;e.preventDefault();if(e.repeat)return;
  if(e.code==='Escape'){pause(!paused);return;}
  if(e.code==='F2'){debug=!debug;return;}
  if(e.code.startsWith('Digit')){if(index<0)restart(Number(e.code.slice(-1))-1);return;}
  if(paused||world.status==='complete')return;
  keys.add(e.code);if(e.code==='Space')jumpPressed=true;
});
window.addEventListener('keyup',e=>{keys.delete(e.code);if(e.code==='Space')jumpReleased=true;});
window.addEventListener('blur',()=>pause(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(true);});
canvas.addEventListener('pointerdown',()=>{if(boardOpen)return;pause(false);canvas.focus();});
$('restart').onclick=$('again').onclick=()=>{if(boardOpen)return;attempts++;restart();};
$('debug').onclick=()=>{debug=!debug;canvas.focus();};$('board').onclick=board;$('lab').onclick=()=>select(-1);
$('continue').onclick=()=>select(Object.keys(progress.records).length===deliveries.length?0:unlockedCount(progress)-1);
$('next').onclick=()=>index===deliveries.length-1?board():select(index+1);
function frame(now){
  const elapsed=last?Math.min((now-last)/1000,.1):0;last=now;
  if(!paused&&!boardOpen){accumulator+=elapsed;while(accumulator>=DT){
    if(world.status==='dead'){deathDelay+=DT;if(deathDelay>=.35){attempts++;restart(world.station);}}
    else{step(world,{left:keys.has('KeyA')||keys.has('ArrowLeft'),right:keys.has('KeyD')||keys.has('ArrowRight'),down:keys.has('KeyS')||keys.has('ArrowDown'),jumpPressed,jumpReleased});jumpPressed=false;jumpReleased=false;
      for(const event of world.events)sound(event);
      if(world.events.includes('death')){$('feedback').textContent=`${world.failure.cause}. ${world.failure.hint}`;$('feedback').hidden=false;feedbackUntil=now+6500;}
      if(world.events.includes('complete'))completed();
    }accumulator=Math.max(0,accumulator-DT);
  }}
  render(world,{debug,reducedMotion:$('reduced-motion').checked,elapsed:paused?0:elapsed,resetCamera:cameraReset});cameraReset=false;
  $('time').textContent=format(world.time);$('speed').textContent=`${Math.round(Math.abs(world.p.vx))} px/s`;if(now>feedbackUntil)$('feedback').hidden=true;requestAnimationFrame(frame);
}
drawBoard();$('brief').textContent=level.brief;requestAnimationFrame(frame);
