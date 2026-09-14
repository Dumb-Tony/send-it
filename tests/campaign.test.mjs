import test from 'node:test';
import assert from 'node:assert/strict';
import {deliveries,medal,readProgress,recordDelivery,unlockedCount,progressKey} from '../src/campaign.js';
import {createWorld,step,overlap} from '../src/physics.js';
import {campaignRoute,scaffoldWallRoute} from './campaign-routes.js';
test('rookie route contains three ordered shifts with unique jobs',()=>{
  assert.equal(deliveries.length,16);
  assert.deepEqual(deliveries.map(level=>level.shift),[1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3]);
  assert.equal(new Set(deliveries.map(level=>level.id)).size,deliveries.length);
});
test('every delivery declares a readable contract and the campaign mixes handling rules',()=>{
  assert.ok(deliveries.every(level=>level.contract?.type&&level.contract.label&&level.contract.note));
  const types=new Set(deliveries.map(level=>level.contract.type));
  assert.deepEqual(types,new Set(['HOT','STANDARD','FRAGILE','OVERSIZED','SIGNATURE']));
});
for(const [i,level] of deliveries.entries())test(`dispatch ${i+1}: complete delivery from spawn with ordinary inputs`,()=>{
  const w=createWorld(level),driver=campaignRoute(i);let picked=false,jumps=0,wallJumps=0,minY=w.p.y,sawLeft=false,sawRight=false;const states=new Set(),grounds=new Set();
  for(let t=0;t<7200&&w.status!=='complete'&&w.status!=='dead';t++){
    const input=driver(w);sawLeft ||= !!input.left;sawRight ||= !!input.right;if(input.jumpPressed){jumps++;if(w.p.wall)wallJumps++;}step(w,input);picked ||= w.events.includes('pickup');minY=Math.min(minY,w.p.y);states.add(w.p.state);if(w.p.groundId)grounds.add(w.p.groundId);
    for(const b of [...level.solids,...level.conveyors,...w.machines])assert.ok(!overlap({...w.p,x:w.p.x+.02,y:w.p.y+.02,w:w.p.w-.04,h:w.p.h-.04},b),`${level.id} penetrated ${b.id} at ${w.time}`);
  }
  assert.equal(w.status,'complete',JSON.stringify({id:level.id,x:w.p.x,y:w.p.y,failure:w.failure}));
  assert.ok(picked);assert.equal(w.practice,false);assert.ok(w.time<level.targets.express);
  if(i===0)assert.ok(jumps>0,'first route requires its introductory jump');
  if(i===1||i===5)assert.ok(states.has('slide'),'shutter routes require a slide');
  if(i===2)assert.ok(grounds.has('belt')&&jumps>0,'warehouse route requires belt launch');
  if(i===3||i===9||i===10)assert.ok(minY<650,'fan route must leave street level');
  if(i===4)assert.ok(wallJumps>=3,'scaffold parcel requires wall kicks');
  if(i===6)assert.ok(sawLeft&&sawRight,'return job requires a round trip');
  if(i===7)assert.ok(grounds.has('market-belt')&&grounds.has('kitchen-belt')&&jumps>=2,'lunch route chains both belts');
  if(i===8)assert.ok(grounds.has('cargo-lift'),'upper-site delivery requires the cargo lift');
  if(i===12)assert.ok(states.has('slide')&&grounds.has('baggage-belt')&&jumps>0,'transit opener requires gate slide and belt jump');
  if(i===13)assert.ok(minY<500,'platform change requires both updraft transfers');
  if(i===14)assert.ok(wallJumps>=2,'fire-escape collection requires repeated wall kicks');
  if(i===15)assert.ok(sawLeft&&sawRight&&jumps>=5,'last train requires the full obstacle course in both directions');
});
test('parcel collection points are authored throughout the route instead of beside every spawn',()=>{
  assert.ok(deliveries.filter(level=>Math.abs(level.parcel.x-level.spawn.x)>400).length>=8);
  assert.ok(deliveries.filter(level=>level.parcel.y<750).length>=3);
});
test('progress survives serialization, unlocks in order and keeps only improved records',()=>{
  const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
  const progress=readProgress(storage);assert.equal(unlockedCount(progress),1);
  for(let i=0;i<deliveries.length;i++){recordDelivery(progress,deliveries[i],10);assert.equal(unlockedCount(progress),Math.min(i+2,deliveries.length));}
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
