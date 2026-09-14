import { TUNE } from './physics.js';
import {roundedPanel} from './toon.js';
import {platformArt} from './platform-art.js';
import {drawCourier,drawBay} from './art.js';
import {cityBackdrop} from './district-art.js';
import {fanHousing,beltArt,moverArt} from './machine-art.js';
export function createRenderer(canvas){
  const ctx=canvas.getContext('2d');let camera={x:0,y:380},trail=[],artTime=0,particles=[],previous={},landingPose=0;
  function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
  function text(value,x,y,size=12,color='#adc0c7',font='Arial'){ctx.fillStyle=color;ctx.font=`${size}px ${font}`;ctx.fillText(value,x,y);}
  function stripes(x,y,w,h){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();rect(x,y,w,h,'#ed896c');ctx.strokeStyle='#533f3b';ctx.lineWidth=7;for(let i=-h;i<w;i+=20){ctx.beginPath();ctx.moveTo(x+i,y+h);ctx.lineTo(x+i+h,y);ctx.stroke();}ctx.restore();}
  return function render(w,{debug=false,reducedMotion=false,elapsed=0,resetCamera=false}={}){
    const zoom=1.2,p=w.p,W=canvas.width/zoom,H=canvas.height/zoom;
    ctx.save();ctx.scale(zoom,zoom);
    if(resetCamera){particles=[];previous={};landingPose=0;}
    landingPose=Math.max(0,landingPose-elapsed);
    if(p.grounded&&previous.grounded===false&&w.started)landingPose=.14;
    if(!reducedMotion){
      const pickup=w.parcel&&!previous.parcel,landing=p.grounded&&previous.grounded===false&&w.started,death=w.status==='dead'&&previous.status!=='dead';
      if(pickup||landing||death){const n=death?12:pickup?9:5;for(let i=0;i<n;i++){const a=i/n*Math.PI*2;particles.push({x:p.x+p.w/2,y:p.y+(landing?p.h:12),vx:Math.cos(a)*(pickup?95:60),vy:-45+Math.sin(a)*65,life:.45,max:.45,color:death?'#ed805e':pickup?'#ffda72':'#fff0cd'});}}
      particles=particles.filter(v=>v.life>0);for(const v of particles){v.life-=elapsed;v.x+=v.vx*elapsed;v.y+=v.vy*elapsed;v.vy+=130*elapsed;}
    }else particles=[];
    previous={parcel:w.parcel,grounded:p.grounded,status:w.status};
    const targetX=Math.max(0,Math.min(w.level.width-W,p.x-W*.37+p.vx*.12));
    const targetY=Math.max(0,Math.min(w.level.height-H,p.y-H*.58));
    const ease=resetCamera?1:1-Math.exp(-elapsed*8);
    camera.x+=(targetX-camera.x)*ease;camera.y+=(targetY-camera.y)*ease;
    const campaign=!!w.level.district,construction=w.level.district==='CONSTRUCTION';
    artTime+=elapsed;
    const animationTime=reducedMotion?0:artTime;
    cityBackdrop(ctx,w,camera,W,H,animationTime);
    ctx.save();ctx.translate(-camera.x,-camera.y);
    for(const f of w.level.fans){
      rect(f.x,f.y,f.w,f.h,'#56bac345');
      ctx.strokeStyle='#267f87';ctx.lineWidth=2;ctx.setLineDash([5,8]);ctx.strokeRect(f.x,f.y,f.w,f.h);ctx.setLineDash([]);
      for(let i=0;i<14;i++){const x=f.x+12+(i*43)%(f.w-24),y=f.y+((i*61-w.time*165)%f.h+f.h)%f.h;text('↑',x,y,23,'#216e7aa0');}
      rect(f.x,f.y+f.h-8,f.w,8,'#267f87');
    }
    for(const b of w.level.solids)platformArt(ctx,b,construction);
    for(const s of w.level.slopes){ctx.fillStyle='#53666c';ctx.beginPath();ctx.moveTo(s.x,s.y1);ctx.lineTo(s.x+s.w,s.y2);ctx.lineTo(s.x+s.w,870);ctx.lineTo(s.x,870);ctx.closePath();ctx.fill();ctx.strokeStyle='#c2cecb';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(s.x,s.y1);ctx.lineTo(s.x+s.w,s.y2);ctx.stroke();}
    for(const c of w.level.conveyors)beltArt(ctx,c,w.time);
    for(const m of w.machines)moverArt(ctx,m,w.level.movers.find(s=>s.id===m.id));
    for(const f of w.level.fans)fanHousing(ctx,f,animationTime);
    for(const h of w.level.hazards)stripes(h.x,h.y,h.w,h.h);
    for(const l of w.level.labels){ctx.font='11px Arial';const width=Math.max(ctx.measureText(l.sub).width+24,l.title.length*8+24);rect(l.x-8,l.y-16,width,51,'#21485825');rect(l.x-10,l.y-20,width,52,'#fff5e5ef');rect(l.x-10,l.y-20,4,52,'#e47243');text(l.title,l.x,l.y,13,'#244b62');text(l.sub,l.x,l.y+20,11,'#465b65');}
    text(campaign?'SEND IT COURIER CO.  /  NO ADDRESS TOO UNREASONABLE':'RECOVERY FLOOR  /  A FALL CAN BE A NEW ROUTE',campaign?65:1180,945,16,'#a6b8bb');
    const d=w.level.delivery;
    drawBay(ctx,d,w.parcel,animationTime);
    if(!w.parcel){
      const q=w.level.parcel,pulse=.5+.5*Math.sin(animationTime*5),cx=q.x+q.w/2;
      ctx.save();ctx.globalAlpha=.22+pulse*.16;ctx.fillStyle='#ff3fd1';ctx.beginPath();ctx.ellipse(cx,q.y+q.h/2,q.w*.95,q.h*.9,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
      ctx.strokeStyle='#fff8d8';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,q.y-52-pulse*8);ctx.lineTo(cx,q.y-8);ctx.stroke();
      roundedPanel(ctx,q.x,q.y,q.w,q.h,'#ff3f81',7);ctx.strokeStyle='#172c45';ctx.lineWidth=4;ctx.strokeRect(q.x+2,q.y+2,q.w-4,q.h-4);
      roundedPanel(ctx,q.x+q.w*.42,q.y,5,q.h,'#fff1a8',1);roundedPanel(ctx,q.x+5,q.y+7,q.w-10,8,'#fff1a8',2);
      ctx.restore();text('COLLECT',q.x-7,q.y-68-pulse*8,11,'#fff8d8','Arial');
    }
    if(resetCamera)trail=[];
    if(!reducedMotion&&Math.abs(p.vx)>420&&w.status==='running'){trail.push({x:p.x,y:p.y,h:p.h});if(trail.length>8)trail.shift();}else trail.shift();
    trail.forEach((v,i)=>{ctx.globalAlpha=i/trail.length*.18;rect(v.x,v.y,p.w,v.h,'#f5c66b');});ctx.globalAlpha=1;
    if(w.status!=='dead'){
      const feet=p.y+p.h,cx=p.x+p.w/2;
      const support=[...w.level.solids,...w.level.conveyors,...w.machines].filter(b=>b.y>=feet-2&&cx>=b.x&&cx<=b.x+b.w).sort((a,b)=>a.y-b.y)[0];
      if(support){const gap=Math.max(0,support.y-feet);if(gap<320){const x=Math.max(support.x+3,Math.min(support.x+support.w-3,cx-gap*.2));ctx.save();ctx.beginPath();ctx.rect(support.x,support.y,support.w,support.h);ctx.clip();ctx.fillStyle=`rgba(20,32,48,${.34/(1+gap/130)})`;ctx.beginPath();ctx.ellipse(x,support.y+2,Math.max(6,15-gap*.022),3.5,0,0,Math.PI*2);ctx.fill();ctx.restore();}}
      drawCourier(ctx,w.started?p:{...p,grounded:true,vy:0},artTime,w.parcel,{landing:landingPose/.14,reducedMotion,delivered:w.status==='complete'});
    }else {text(w.failure?.cause||'RETRY',p.x-45,p.y-20,16,'#f1a184');ctx.strokeStyle='#f1a184';ctx.lineWidth=3;ctx.strokeRect(p.x-5,p.y-5,p.w+10,p.h+10);}
    for(const v of particles){ctx.globalAlpha=Math.max(0,v.life/v.max);rect(v.x-2,v.y-2,4,4,v.color);}ctx.globalAlpha=1;
    if(debug){ctx.strokeStyle='#8fffaa';ctx.strokeRect(p.x,p.y,p.w,p.h);ctx.beginPath();ctx.moveTo(p.x+12,p.y+18);ctx.lineTo(p.x+12+p.vx*.18,p.y+18+p.vy*.18);ctx.stroke();}
    ctx.restore();
    rect(20,20,290,50,'#152831dd');text(w.practice?'PRACTICE / RECORDS OFF':w.parcel?'PARCEL SECURED → DELIVERY BAY':'COLLECT THE PARCEL →',34,41,12,'#f3cc85');text(w.started?(campaign?'R: RETRY · ESC: PAUSE':'1–8: jump to a lab station'):'A / D TO START · SPACE TO JUMP',34,59,10);
    if(campaign){rect(20,H-22,W-40,4,'#15283199');rect(20,H-22,(W-40)*Math.max(0,Math.min(1,p.x/d.x)),4,'#f5c66b');}
    if(p.ledge){rect(W/2-225,H-64,450,42,'#152831ef');text('HOLD TOWARD EDGE: CLIMB   /   S: DROP   /   SPACE: KICK',W/2-207,H-39,11,'#f3cc85');}
    if(debug){rect(20,85,285,132,'#11232beF');const lines=[`${p.state.toUpperCase()} | ${w.status}`,`x ${p.x.toFixed(1)}  y ${p.y.toFixed(1)}`,`vx ${p.vx.toFixed(1)}  vy ${p.vy.toFixed(1)}`,`ground ${p.groundId||'—'}  wall ${p.wall}`,`coyote ${p.coyote.toFixed(3)}  buffer ${p.buffer.toFixed(3)}`,`120 Hz | physics ${TUNE.runSpeed} run cap`];lines.forEach((s,i)=>text(s,32,106+i*19,12,'#b8dcc6','monospace'));}
    // Direction marker remains readable when the destination is outside the camera.
    if(d.x>camera.x+W-60){rect(W-142,20,123,30,'#244b45');text('DELIVERY ↗',W-130,40,12,'#fff0c8');}
    ctx.restore();
  };
}
