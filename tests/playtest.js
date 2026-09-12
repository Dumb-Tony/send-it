import {lab} from '../src/level.js';
import {createWorld,step,DT} from '../src/physics.js';
import {createRenderer} from '../src/render.js';
import {standardRoute,wallRoute,withJumpReleases} from './routes.js';
const $=id=>document.getElementById(id),render=createRenderer($('game'));
let w=createWorld(lab),driver=null,playing=false,last=0,acc=0,snap=true,checkpoints=[],seen=new Set(),name='Ready';
function start(factory,label){w=createWorld(lab);driver=withJumpReleases(factory());name=label;playing=true;acc=0;snap=true;checkpoints=[];seen=new Set();}
function tick(){
  if(!driver||w.status==='dead'||w.status==='complete')return;
  const input=driver(w),oldWall=w.p.wall;
  step(w,input);
  $('input').textContent=`Input: ${Object.keys(input).filter(k=>input[k]).join(' + ')||'none'}`;
  let checkpoint=w.p.groundId;
  if(input.jumpPressed&&oldWall)checkpoint=`wall kick ${oldWall<0?'left':'right'} at ${Math.round(w.p.y)}`;
  if(w.parcel&&!seen.has('parcel')){seen.add('parcel');checkpoints.push(`${w.time.toFixed(3)}s  parcel collected`);}
  if(checkpoint&&!seen.has(checkpoint)){seen.add(checkpoint);checkpoints.push(`${w.time.toFixed(3)}s  ${checkpoint}`);}
  $('status').textContent=`${name}: ${w.status.toUpperCase()} | ${w.time.toFixed(3)}s | x ${Math.round(w.p.x)} y ${Math.round(w.p.y)} | ${w.p.state}${w.failure?' | '+w.failure.cause:''}`;
  if(w.status==='complete'){$('status').textContent+= ' | PARCEL DELIVERED — NO WARP';playing=false;}
  if(w.status==='dead')playing=false;
  $('checkpoints').textContent=checkpoints.join('\n');
}
$('lower').onclick=()=>start(standardRoute,'Lower route');$('wall').onclick=()=>start(wallRoute,'Wall route');$('pause').onclick=()=>{playing=!playing;acc=0;};$('tick').onclick=()=>{playing=false;for(let i=0;i<30;i++)tick();};
function frame(now){const elapsed=last?Math.min((now-last)/1000,.1):0;last=now;if(playing){acc+=elapsed;while(acc>=DT){tick();acc-=DT;}}render(w,{debug:true,reducedMotion:true,elapsed,resetCamera:snap});snap=false;requestAnimationFrame(frame);}
requestAnimationFrame(frame);
