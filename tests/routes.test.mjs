import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorld,step,overlap,reset} from '../src/physics.js';
import {lab} from '../src/level.js';
import {standardRoute,wallRoute,withJumpReleases} from './routes.js';

for(const [name,makeDriver] of [['lower passage',standardRoute],['wall climb',wallRoute]]){
  test(`complete parcel delivery via ${name}, using inputs from spawn`,()=>{
    const w=createWorld(lab),drive=withJumpReleases(makeDriver());let slid=false,wallKicks=0;const contacts=new Set();
    for(let i=0;i<3600&&w.status!=='complete';i++){
      const input=drive(w);if(w.p.wall&&input.jumpPressed&&!w.p.grounded)wallKicks++;
      step(w,input);assert.notEqual(w.status,'dead',JSON.stringify(w.failure));
      if(w.p.x>800&&w.p.x<920&&w.p.h===22)slid=true;
      if(w.p.groundId)contacts.add(w.p.groundId);
      const body={x:w.p.x+.25,y:w.p.y+.25,w:w.p.w-.5,h:w.p.h-.5};
      assert.equal(lab.solids.some(b=>overlap(body,b)),false,`solid overlap at ${w.p.x}, ${w.p.y}`);
    }
    assert.equal(w.status,'complete');assert.equal(w.parcel,true);assert.equal(w.practice,false);
    assert.ok(slid);assert.ok(contacts.has('lift'));assert.ok(contacts.has('belt'));
    if(name==='wall climb')assert.ok(wallKicks>=4,`only ${wallKicks} wall kicks`);
  });
}
test('original BONK reproduction clears the ramp seam without any solid penetration',()=>{
  const w=createWorld(lab);for(let i=0;i<280;i++){
    step(w,{right:true,jumpPressed:i===89,down:w.p.x>720});
    assert.notEqual(w.status,'dead');
    assert.ok(!lab.solids.some(b=>overlap({x:w.p.x+.2,y:w.p.y+.2,w:w.p.w-.4,h:w.p.h-.4},b)),`overlap on tick ${i}`);
  }
  assert.ok(w.p.x>960);
});
test('run-up and ramp survive a range of jump timings',()=>{
  for(let jumpTick=60;jumpTick<=210;jumpTick+=3){
    const w=createWorld(lab);for(let i=0;i<400;i++)step(w,{right:true,jumpPressed:i===jumpTick,down:w.p.x>720&&w.p.x<960});
    assert.notEqual(w.status,'dead',`jump at ${jumpTick}`);
    assert.ok(w.p.x>960,`blocked jump at ${jumpTick}: x=${w.p.x}`);
  }
});
test('marked floor hazard reports a specific cause and useful retry hint',()=>{
  const w=createWorld(lab);reset(w,3);for(let i=0;i<240&&w.status!=='dead';i++)step(w,{right:true});
  assert.equal(w.status,'dead');assert.equal(w.failure.objectId,'pit');assert.match(w.failure.hint,/Jump/);assert.match(w.failure.cause,/striped floor/);
});
