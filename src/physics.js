export const DT = 1/120;
export const PHYSICS_VERSION = 'lab-0.2';
export const TUNE = Object.freeze({width:24,height:36,crouchHeight:22,accel:1900,airAccel:800,runSpeed:390,maxSpeed:1100,friction:1550,airDrag:45,gravity:1850,jump:620,jumpCut:0.48,fallSpeed:1150,wallFall:150,wallKick:440,coyote:0.09,buffer:0.12,slopeGravity:1100,slideFriction:85});
export const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const approach=(v,t,d)=>v<t?Math.min(v+d,t):Math.max(v-d,t);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function machineAt(m,time) {
  // Smooth periodic motion; velocity derives from actual displacement each fixed step.
  const phase=(1-Math.cos(time*Math.PI*2/m.period))/2;
  return {...m,x:m.x+(m.axis==='x'?m.distance*phase:0),y:m.y+(m.axis==='y'?m.distance*phase:0)};
}
export function createWorld(level) {
  const world={level,p:null,time:0,ticks:0,started:false,status:'ready',deaths:0,practice:false,events:[],machines:[],parcel:false};
  reset(world); return world;
}
export function reset(w,station=-1) {
  const s=station<0?w.level.spawn:w.level.stations[station];
  w.p={x:s.x,y:s.y,w:TUNE.width,h:TUNE.height,vx:0,vy:0,grounded:false,groundId:null,wall:0,coyote:0,buffer:0,cutBuffered:false,wallLock:0,facing:1,state:'air',slope:0};
  w.time=0;w.ticks=0;w.started=false;w.status='ready';w.parcel=false;w.practice=station>=0;w.station=station;w.events=[];w.failure=null;
  w.machines=w.level.movers.map(m=>({...machineAt(m,0),vx:0,vy:0,dx:0,dy:0}));
}
function jump(w,vx,vy) {const p=w.p;p.vx=vx;p.vy=vy;p.grounded=false;p.groundId=null;p.coyote=0;p.buffer=0;w.events.push('jump');}
function die(w,cause,hint,objectId) {if(w.status==='dead')return;w.failure={cause,hint,objectId,x:w.p.x,y:w.p.y};w.status='dead';w.deaths++;w.events.push('death');}
export function step(w,input={},dt=DT) {
  w.events=[];
  if(w.status==='dead'||w.status==='complete')return;
  const p=w.p, level=w.level;
  const dir=(input.right?1:0)-(input.left?1:0);
  if(!w.started&&(dir||input.jumpPressed||input.down)) {w.started=true;w.status='running';}
  if(!w.started)return;
  w.ticks++;w.time=w.ticks*dt;
  w.machines=level.movers.map(m=>{const now=machineAt(m,w.time),old=machineAt(m,w.time-dt);return {...now,dx:now.x-old.x,dy:now.y-old.y,vx:(now.x-old.x)/dt,vy:(now.y-old.y)/dt};});
  const blocks=[...level.solids,...level.conveyors,...w.machines];
  const support=blocks.find(b=>b.id===p.groundId);
  const wasGrounded=p.grounded;
  if(wasGrounded&&support?.kind){p.x+=support.dx;p.y+=support.dy;}
  p.coyote=wasGrounded?TUNE.coyote:Math.max(0,p.coyote-dt);
  p.buffer=input.jumpPressed?TUNE.buffer:Math.max(0,p.buffer-dt);
  if(input.jumpPressed)p.cutBuffered=false;
  if(input.jumpReleased&&p.buffer>0)p.cutBuffered=true;
  p.wallLock=Math.max(0,p.wallLock-dt);
  const feet=p.y+p.h;
  if(input.down){p.h=TUNE.crouchHeight;p.y=feet-p.h;}
  else if(p.h<TUNE.height) {const standing={x:p.x,y:feet-TUNE.height,w:p.w,h:TUNE.height};if(!blocks.some(b=>overlap(standing,b))){p.h=TUNE.height;p.y=standing.y;}}
  if(dir)p.facing=dir;
  if(p.wallLock<=0){
    if(dir){const accel=wasGrounded?TUNE.accel:TUNE.airAccel;
      // Input accelerates toward run speed but never clamps a machine boost away.
      if(p.vx*dir<TUNE.runSpeed)p.vx=approach(p.vx,dir*TUNE.runSpeed,accel*dt);
    } else p.vx=approach(p.vx,0,(wasGrounded?(input.down?TUNE.slideFriction:TUNE.friction):TUNE.airDrag)*dt);
  }
  if(wasGrounded&&p.slope){p.vx+=p.slope*TUNE.slopeGravity*dt;}
  if(wasGrounded&&support?.speed){p.vx=approach(p.vx,(dir?dir*TUNE.runSpeed:0)+support.speed,2100*dt);}
  if(p.buffer>0){
    if(p.coyote>0)jump(w,p.vx+(support?.vx||0),-TUNE.jump+Math.min(0,support?.vy||0));
    else if(p.wall){jump(w,-p.wall*Math.max(TUNE.wallKick,Math.abs(p.vx)*0.8),-TUNE.jump*0.93);p.wallLock=0.13;}
  }
  if((input.jumpReleased||p.cutBuffered)&&p.vy<0){p.vy*=TUNE.jumpCut;p.cutBuffered=false;}
  p.vy+=TUNE.gravity*dt;
  for(const f of level.fans)if(overlap(p,f))p.vy-=f.force*dt;
  p.vx=clamp(p.vx,-TUNE.maxSpeed,TUNE.maxSpeed);p.vy=clamp(p.vy,-1300,TUNE.fallSpeed);
  p.grounded=false;p.groundId=null;p.slope=0;p.wall=0;
  // Spatial microsteps bound displacement below the thinnest collision surface.
  const count=Math.max(1,Math.ceil(Math.max(Math.abs(p.vx*dt),Math.abs(p.vy*dt))/6));
  for(let n=0;n<count;n++){
    const beforeX=p.x;const oldFeet=p.y+p.h;
    p.x+=p.vx*dt/count;
    for(const b of blocks)if(overlap(p,b)){
      // Auto-step only short lips, at low speed, with clear headroom.
      const rise=oldFeet-b.y;
      const mantle={...p,y:b.y-p.h};
      if(wasGrounded&&rise>0&&rise<=30&&Math.abs(p.vx)<460&&!input.down&&!blocks.some(o=>o!==b&&overlap(mantle,o))){p.y=mantle.y;p.grounded=true;p.groundId=b.id;continue;}
      if(beforeX+p.w<=b.x+0.5){p.x=b.x-p.w;p.wall=1;p.vx=0;}
      else if(beforeX>=b.x+b.w-0.5){p.x=b.x+b.w;p.wall=-1;p.vx=0;}
    }
    const beforeY=p.y; // Auto-step may have changed height during horizontal resolution.
    p.y+=p.vy*dt/count;
    for(const b of blocks)if(overlap(p,b)){
      if(beforeY+p.h<=b.y+Math.max(1,Math.abs(b.dy||0))&&p.vy>=0){
        p.y=b.y-p.h;if(!wasGrounded&&p.vy>350)w.events.push('land');p.vy=0;p.grounded=true;p.groundId=b.id;
      }else if(beforeY>=b.y+b.h-1&&p.vy<0){p.y=b.y+b.h;p.vy=0;}
    }
    for(const s of level.slopes){
      const center=p.x+p.w/2;
      if(center<s.x||center>s.x+s.w)continue;
      const slope=(s.y2-s.y1)/s.w;
      let surface=s.y1+(center-s.x)*slope;
      // At a flat/ramp seam, the trailing foot is still on the flat top.
      // Do not let center sampling pull the collider into that support.
      for(const b of blocks)if(p.x+p.w>b.x&&p.x<b.x+b.w&&oldFeet<=b.y+0.5)surface=Math.min(surface,b.y);
      const previous=s.y1+clamp(beforeX+p.w/2-s.x,0,s.w)*slope;
      if(p.vy>=0&&oldFeet<=previous+8&&p.y+p.h>=surface-(wasGrounded?8:0)) {p.y=surface-p.h;p.vy=0;p.grounded=true;p.groundId=s.id;p.slope=slope;}
    }
    const hazard=level.hazards.find(h=>overlap(p,h));
    if(hazard){die(w,hazard.name||'Hit a marked hazard',hazard.hint||'Coral-striped surfaces are dangerous. Jump clear of them.',hazard.id);return;}
  }
  // Stable wall contact when the previous collision removed horizontal velocity.
  for(const b of blocks)if(p.y+p.h>b.y+2&&p.y<b.y+b.h-2){if(Math.abs(p.x+p.w-b.x)<0.1)p.wall=1;if(Math.abs(p.x-b.x-b.w)<0.1)p.wall=-1;}
  if(!p.grounded&&p.wall&&p.vy>TUNE.wallFall&&dir===p.wall)p.vy=TUNE.wallFall;
  // A rising platform presses into the player; lift them onto its top, then detect crushing.
  for(const m of w.machines)if(overlap(p,m)&&m.dy<0){p.y=m.y-p.h;p.vy=Math.min(0,p.vy);p.grounded=true;p.groundId=m.id;}
  const trapped=blocks.find(b=>overlap({x:p.x+0.2,y:p.y+0.2,w:p.w-0.4,h:p.h-0.4},b));
  if(trapped) {
    const movingContact=w.machines.some(m=>m.id===p.groundId||overlap(p,m));
    if(movingContact){die(w,'Crushed by machinery','Jump off the moving platform before it presses you into a ceiling.',trapped.id);return;}
    // Ordinary solid geometry blocks movement; it is never a lethal surface.
    const corrections=[{axis:'x',d:trapped.x-p.x-p.w},{axis:'x',d:trapped.x+trapped.w-p.x},{axis:'y',d:trapped.y-p.y-p.h},{axis:'y',d:trapped.y+trapped.h-p.y}];
    const correction=corrections.sort((a,b)=>Math.abs(a.d)-Math.abs(b.d))[0];
    p[correction.axis]+=correction.d;
    if(correction.axis==='x')p.vx=0;else {p.vy=0;if(correction.d<0){p.grounded=true;p.groundId=trapped.id;}}
  }
  if(p.y>level.height+80){die(w,'Fell outside the lab','Land on the lower recovery floor or press R to retry.','bounds');return;}
  if(!w.parcel&&overlap(p,level.parcel)){w.parcel=true;w.events.push('pickup');}
  if(w.parcel&&overlap(p,level.delivery)){w.status='complete';w.events.push('complete');}
  p.state=p.grounded?(p.h<TUNE.height?'slide':Math.abs(p.vx)>10?'run':'idle'):p.wall&&p.vy>0?'wall slide':p.vy<0?'rise':'fall';
}
