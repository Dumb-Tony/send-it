import {lab} from '../src/level.js';
import {createWorld,step,reset,DT} from '../src/physics.js';
import {createRenderer} from '../src/render.js';
import {standardRoute,wallRoute,withJumpReleases} from './routes.js';
import {deliveries} from '../src/campaign.js';
import {campaignRoute,scaffoldWallRoute} from './campaign-routes.js';
const $=id=>document.getElementById(id),render=createRenderer($('game'));
let w=createWorld(lab),driver=null,playing=false,last=0,acc=0,snap=true,checkpoints=[],seen=new Set(),name='Ready';
function start(factory,label){w=createWorld(lab);driver=withJumpReleases(factory());name=label;playing=true;acc=0;snap=true;checkpoints=[];seen=new Set();}
deliveries.forEach((level,i)=>{const b=document.createElement('button');b.textContent=`Dispatch ${i+1}`;b.onclick=()=>{start(standardRoute,level.name);w=createWorld(level);driver=campaignRoute(i);};$('campaign').append(b);});
const upper=document.createElement('button');upper.textContent='Scaffold upper route';upper.onclick=()=>{start(standardRoute,'Scaffold upper route');w=createWorld(deliveries[4]);driver=scaffoldWallRoute();};$('campaign').append(upper);
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
  if(name==='Ledge check'&&w.p.groundId==='ledge-practice'){$('status').textContent+=' | LEDGE CHECK PASSED';playing=false;driver=null;}
  $('checkpoints').textContent=checkpoints.join('\n');
}
$('lower').onclick=()=>start(standardRoute,'Lower route');$('wall').onclick=()=>start(wallRoute,'Wall route');$('pause').onclick=()=>{playing=!playing;acc=0;};$('tick').onclick=()=>{playing=false;for(let i=0;i<30;i++)tick();};
$('ledge').onclick=()=>{
  let tick=0,hang=0;
  start(()=>world=>{const p=world.p;tick++;if(p.ledge&&hang++<36)return {};return {right:p.x<2300||p.wall===1,jumpPressed:tick===1};},'Ledge check');
  reset(w,7);
};
function frame(now){const elapsed=last?Math.min((now-last)/1000,.1):0;last=now;if(playing){acc+=elapsed;while(acc>=DT){tick();acc-=DT;}}render(w,{debug:true,reducedMotion:true,elapsed,resetCamera:snap});snap=false;requestAnimationFrame(frame);}
requestAnimationFrame(frame);
