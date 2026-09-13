import test from 'node:test';
import assert from 'node:assert/strict';
import {deliveries,medal,readProgress,recordDelivery,unlockedCount,progressKey} from '../src/campaign.js';
import {createWorld,step,overlap} from '../src/physics.js';
import {campaignRoute,scaffoldWallRoute} from './campaign-routes.js';
for(const [i,level] of deliveries.entries())test(`dispatch ${i+1}: complete delivery from spawn with ordinary inputs`,()=>{
  const w=createWorld(level),driver=campaignRoute(i);let picked=false;
  for(let t=0;t<7200&&w.status!=='complete'&&w.status!=='dead';t++){
    step(w,driver(w));picked ||= w.events.includes('pickup');
    for(const b of [...level.solids,...level.conveyors,...w.machines])assert.ok(!overlap({...w.p,x:w.p.x+.02,y:w.p.y+.02,w:w.p.w-.04,h:w.p.h-.04},b),`${level.id} penetrated ${b.id} at ${w.time}`);
  }
  assert.equal(w.status,'complete',JSON.stringify({id:level.id,x:w.p.x,y:w.p.y,failure:w.failure}));
  assert.ok(picked);assert.equal(w.practice,false);assert.ok(w.time<level.targets.express);
});
test('progress survives serialization, unlocks in order and keeps only improved records',()=>{
  const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
  const progress=readProgress(storage);assert.equal(unlockedCount(progress),1);
  for(let i=0;i<deliveries.length;i++){recordDelivery(progress,deliveries[i],10);assert.equal(unlockedCount(progress),Math.min(i+2,6));}
  assert.equal(recordDelivery(progress,deliveries[0],12),false);recordDelivery(progress,deliveries[0],9);
  storage.setItem(progressKey,JSON.stringify(progress));assert.deepEqual(readProgress(storage),progress);
});
test('scaffold upper route delivers with four wall kicks and a rooftop transfer',()=>{
  const w=createWorld(deliveries[4]),driver=scaffoldWallRoute();let kicks=0,scaffold=false;
  for(let t=0;t<2400&&w.status!=='complete'&&w.status!=='dead';t++){
    const input=driver(w);if(input.jumpPressed&&w.p.wall)kicks++;step(w,input);
    scaffold ||= w.p.groundId==='scaffold';
    for(const b of w.level.solids)assert.ok(!overlap({...w.p,x:w.p.x+.02,y:w.p.y+.02,w:w.p.w-.04,h:w.p.h-.04},b));
  }
  assert.equal(w.status,'complete');assert.ok(kicks>=4);assert.ok(scaffold);assert.ok(w.parcel);
});
test('malformed and denied storage are safe; invalid records cannot unlock deliveries',()=>{
  for(const storage of [undefined,{getItem(){throw Error('denied');}},{getItem:()=>'{bad'},{getItem:()=>'{"records":{"corner-shop":-2,"shutter-run":"1","unknown":3}}'}])assert.deepEqual(readProgress(storage),{records:{}});
  const progress={records:{}};assert.equal(recordDelivery(progress,deliveries[0],Infinity),false);assert.equal(unlockedCount(progress),1);
  assert.equal(medal(3.4,deliveries[0].targets),'UNHINGED');assert.equal(medal(7,deliveries[0].targets),'EXPRESS');
});
