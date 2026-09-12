import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorld,step,reset,overlap,DT,TUNE} from '../src/physics.js';
import {lab} from '../src/level.js';
function nearEdge(){
  const level={width:1000,height:1000,spawn:{x:126,y:592},parcel:{x:900,y:0,w:10,h:10},delivery:{x:950,y:0,w:20,h:20},solids:[{id:'ledge',x:150,y:600,w:160,h:30},{id:'floor',x:0,y:900,w:1000,h:100}],slopes:[],conveyors:[],fans:[],movers:[],hazards:[],stations:[]};
  const w=createWorld(level);w.p.vx=100;w.p.vy=80;return w;
}
test('slow approach catches, holds, then mantles without penetrating terrain',()=>{
  const w=nearEdge();step(w,{right:true});assert.equal(w.p.state,'ledge hang');
  for(let i=0;i<40;i++)step(w);assert.equal(w.p.state,'ledge hang');assert.equal(w.p.y,592);
  for(let i=0;i<35;i++){step(w,{right:true});assert.ok(!w.level.solids.some(b=>overlap(w.p,b)));}
  assert.equal(w.p.groundId,'ledge');assert.equal(w.p.y,564);assert.ok(w.p.x>=152);
});
test('down drops and cooldown prevents immediate recatch',()=>{
  const w=nearEdge();step(w,{right:true});step(w,{down:true});assert.equal(w.p.ledge,null);assert.ok(w.p.vy>0);
  for(let i=0;i<15;i++)step(w,{right:true});assert.equal(w.p.ledge,null);
});
test('jump kicks away from a caught edge exactly once',()=>{
  const w=nearEdge();step(w,{right:true});step(w,{jumpPressed:true,right:true});
  assert.equal(w.p.ledge,null);assert.ok(w.p.vx<0&&w.p.vy<0);assert.equal(w.events.filter(e=>e==='jump').length,1);
});
test('ledge assist does not steal a fast wall contact, slide or buffered jump',()=>{
  for(const mode of ['fast','slide','jump']){const w=nearEdge();if(mode==='fast')w.p.vx=650;if(mode==='jump')w.p.wall=1;
    step(w,{right:true,down:mode==='slide',jumpPressed:mode==='jump'});assert.equal(w.p.ledge,null,mode);
    if(mode==='fast'){step(w,{right:true});assert.equal(w.p.ledge,null,'speed was removed by collision');}
    if(mode==='jump')assert.ok(w.p.vy<0);
  }
});
test('ledge catch checks overhead clearance and excludes moving edges',()=>{
  const w=nearEdge();w.level.solids.push({id:'roof',x:150,y:554,w:160,h:20});step(w,{right:true});assert.equal(w.p.ledge,null);
  const moving=nearEdge();const ledge=moving.level.solids.shift();moving.level.movers.push({...ledge,kind:'lift',axis:'y',distance:-30,period:4});step(moving,{right:true});assert.equal(moving.p.ledge,null);
});
test('a hanging courier remains vulnerable when a hazard enters the pose',()=>{
  const w=nearEdge();step(w,{right:true});assert.ok(w.p.ledge);
  w.level.hazards.push({id:'moving-hazard',x:120,y:585,w:30,h:55});step(w);
  assert.equal(w.status,'dead');assert.equal(w.failure.objectId,'moving-hazard');
});
test('left-facing ledge catch and climb mirror the right-facing behavior',()=>{
  const w=nearEdge();w.p.x=310;w.p.vx=-100;step(w,{left:true});assert.equal(w.p.ledge?.side,-1);
  for(let i=0;i<35;i++)step(w,{left:true});assert.equal(w.p.groundId,'ledge');assert.ok(w.p.x<286);
});
test('ledge practice is reachable from its floor spawn using real inputs',()=>{
  const w=createWorld(lab);reset(w,7);const events=[];
  for(let i=0;i<90;i++){step(w,{right:w.p.x<2300||w.p.wall===1,jumpPressed:i===0,jumpReleased:i===45});events.push(...w.events);if(w.p.groundId==='ledge-practice')break;}
  assert.ok(events.includes('grab'));assert.ok(events.includes('mantle'));assert.equal(w.p.groundId,'ledge-practice');
});
test('walking off a moving support inherits velocity once; coyote jump does not double it',()=>{
  const w=nearEdge();w.level.solids=w.level.solids.filter(b=>b.id!=='ledge');
  w.level.movers=[{id:'shuttle',kind:'lift',x:100,y:600,w:80,h:20,axis:'x',distance:200,period:4}];
  w.started=true;w.status='running';w.ticks=60;w.time=60*DT;
  // Stand at the right lip at this phase and step off it; carry uses this support.
  const phase=(1-Math.cos(w.time*Math.PI*2/4))/2;
  Object.assign(w.p,{x:100+200*phase+79,y:564,vx:390,vy:0,grounded:true,groundId:'shuttle'});
  step(w,{right:true});const speed=w.p.vx;assert.ok(speed>490);assert.equal(w.p.grounded,false);
  step(w,{right:true,jumpPressed:true});assert.equal(w.p.vx,speed);assert.ok(w.p.vy<0);
  step(w,{right:true});assert.equal(w.p.vx,speed);
});
test('stepping off a rising platform retains lift and supports a late jump',()=>{
  const w=nearEdge();w.level.solids=w.level.solids.filter(b=>b.id!=='ledge');
  w.level.movers=[{id:'lift',kind:'lift',x:100,y:600,w:80,h:20,axis:'y',distance:-200,period:4}];
  w.started=true;w.status='running';w.ticks=60;w.time=.5;
  const y=600-200*(1-Math.cos(.5*Math.PI*2/4))/2;
  Object.assign(w.p,{x:179,y:y-36,vx:390,vy:0,grounded:true,groundId:'lift'});
  step(w,{right:true});assert.equal(w.p.grounded,false);assert.ok(w.p.vy<0);
  step(w,{right:true,jumpPressed:true});assert.ok(w.p.vy<-TUNE.jump);
});
