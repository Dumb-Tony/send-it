import { TUNE } from './physics.js';
import {cityBackdrop,drawCourier,drawBay} from './art.js';
export function createRenderer(canvas){
  const ctx=canvas.getContext('2d');let camera={x:0,y:380},trail=[];
  function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
  function text(value,x,y,size=12,color='#adc0c7',font='Arial'){ctx.fillStyle=color;ctx.font=`${size}px ${font}`;ctx.fillText(value,x,y);}
  function stripes(x,y,w,h){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();rect(x,y,w,h,'#ed896c');ctx.strokeStyle='#533f3b';ctx.lineWidth=7;for(let i=-h;i<w;i+=20){ctx.beginPath();ctx.moveTo(x+i,y+h);ctx.lineTo(x+i+h,y);ctx.stroke();}ctx.restore();}
  return function render(w,{debug=false,reducedMotion=false,elapsed=0,resetCamera=false}={}){
    const p=w.p,W=canvas.width,H=canvas.height;
    const targetX=Math.max(0,Math.min(w.level.width-W,p.x-W*.37+p.vx*.12));
    const targetY=Math.max(0,Math.min(w.level.height-H,p.y-H*.58));
    const ease=resetCamera?1:1-Math.exp(-elapsed*8);
    camera.x+=(targetX-camera.x)*ease;camera.y+=(targetY-camera.y)*ease;
    const campaign=!!w.level.district,construction=w.level.district==='CONSTRUCTION';
    cityBackdrop(ctx,w,camera,W,H);
    ctx.save();ctx.translate(-camera.x,-camera.y);
    for(const f of w.level.fans){
      rect(f.x,f.y,f.w,f.h,'#56bac345');
      ctx.strokeStyle='#267f87';ctx.lineWidth=2;ctx.setLineDash([5,8]);ctx.strokeRect(f.x,f.y,f.w,f.h);ctx.setLineDash([]);
      for(let i=0;i<14;i++){const x=f.x+12+(i*43)%(f.w-24),y=f.y+((i*61-w.time*165)%f.h+f.h)%f.h;text('↑',x,y,23,'#216e7aa0');}
      rect(f.x,f.y+f.h-8,f.w,8,'#267f87');
    }
    for(const b of w.level.solids){rect(b.x,b.y,b.w,b.h,'#293f43');rect(b.x+2,b.y+5,b.w-4,b.h-5,construction?'#937a61':'#8d7864');rect(b.x,b.y,b.w,5,'#fff0ca');rect(b.x,b.y+5,b.w,4,'#bba17f');
      if(b.id==='floor'){rect(b.x,b.y+15,b.w,7,'#3b504c');rect(b.x,b.y+22,b.w,b.h-22,'#425752');for(let x=0;x<b.w;x+=90){rect(x,b.y+8,2,7,'#6d6c58');rect(x+20,b.y+68,38,3,'#738173');}}
      else if(b.h>45){for(let y=b.y+28;y<b.y+b.h;y+=24){rect(b.x+3,y,b.w-6,1,'#524e4435');for(let x=b.x+18+(Math.round(y/24)%2)*22;x<b.x+b.w-3;x+=44)rect(x,y-20,1,20,'#524e4435');}}
      if(campaign&&b.id==='shutter'){for(let y=b.y+12;y<b.y+b.h;y+=12)rect(b.x+5,y,b.w-10,2,'#a0aba080');}
    }
    for(const s of w.level.slopes){ctx.fillStyle='#53666c';ctx.beginPath();ctx.moveTo(s.x,s.y1);ctx.lineTo(s.x+s.w,s.y2);ctx.lineTo(s.x+s.w,870);ctx.lineTo(s.x,870);ctx.closePath();ctx.fill();ctx.strokeStyle='#c2cecb';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(s.x,s.y1);ctx.lineTo(s.x+s.w,s.y2);ctx.stroke();}
    for(const c of w.level.conveyors){rect(c.x,c.y,c.w,c.h,'#d8ad61');for(let x=c.x+8;x<c.x+c.w-8;x+=24)text('›',x+(w.time*75)%20,c.y+12,18,'#5e4a2d');}
    for(const m of w.machines){
      const source=w.level.movers.find(s=>s.id===m.id);
      ctx.strokeStyle='#d3ab5935';ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(source.x+m.w/2,source.y);ctx.lineTo(source.x+m.w/2,source.y+source.distance);ctx.stroke();ctx.setLineDash([]);
      if(m.kind==='piston'){rect(m.x+35,m.y+m.h,30,870-m.y-m.h,'#8a744b');rect(m.x+44,m.y+m.h,12,870-m.y-m.h,'#c4ad77');}
      rect(m.x,m.y,m.w,m.h,'#e3b966');rect(m.x,m.y,m.w,4,'#ffdf9c');text(m.kind==='piston'?'↑ LAUNCH':'↑ LIFT',m.x+12,m.y+17,10,'#443d2d');
    }
    for(const h of w.level.hazards)stripes(h.x,h.y,h.w,h.h);
    for(const l of w.level.labels){ctx.font='11px Arial';const width=Math.max(ctx.measureText(l.sub).width+24,l.title.length*8+24);rect(l.x-10,l.y-20,width,52,'#fff2dce8');rect(l.x-10,l.y-20,4,52,'#d66b4b');text(l.title,l.x,l.y,13,'#273e40');text(l.sub,l.x,l.y+20,11,'#465b55');}
    text(campaign?'SEND IT COURIER CO.  /  NO ADDRESS TOO UNREASONABLE':'RECOVERY FLOOR  /  A FALL CAN BE A NEW ROUTE',campaign?65:1180,945,16,'#a6b8bb');
    const d=w.level.delivery;
    drawBay(ctx,d,w.parcel);
    if(!w.parcel){const q=w.level.parcel;rect(q.x,q.y,q.w,q.h,'#f3c77a');rect(q.x+9,q.y,4,q.h,'#b2894d');text('PICK UP',q.x-12,q.y-17,10,'#f3c77a');}
    if(resetCamera)trail=[];
    if(!reducedMotion&&Math.abs(p.vx)>420&&w.status==='running'){trail.push({x:p.x,y:p.y,h:p.h});if(trail.length>8)trail.shift();}else trail.shift();
    trail.forEach((v,i)=>{ctx.globalAlpha=i/trail.length*.18;rect(v.x,v.y,p.w,v.h,'#f5c66b');});ctx.globalAlpha=1;
    if(w.status!=='dead'){
      drawCourier(ctx,p,w.time,w.parcel);
    }else {text(w.failure?.cause||'RETRY',p.x-45,p.y-20,16,'#f1a184');ctx.strokeStyle='#f1a184';ctx.lineWidth=3;ctx.strokeRect(p.x-5,p.y-5,p.w+10,p.h+10);}
    if(debug){ctx.strokeStyle='#8fffaa';ctx.strokeRect(p.x,p.y,p.w,p.h);ctx.beginPath();ctx.moveTo(p.x+12,p.y+18);ctx.lineTo(p.x+12+p.vx*.18,p.y+18+p.vy*.18);ctx.stroke();}
    ctx.restore();
    rect(20,20,290,50,'#152831dd');text(w.practice?'PRACTICE / RECORDS OFF':w.parcel?'PARCEL SECURED → DELIVERY BAY':'COLLECT THE PARCEL →',34,41,12,'#f3cc85');text(w.started?(campaign?'R: RETRY · ESC: PAUSE':'1–8: jump to a lab station'):'A / D TO START · SPACE TO JUMP',34,59,10);
    if(campaign){rect(20,H-22,W-40,4,'#15283199');rect(20,H-22,(W-40)*Math.max(0,Math.min(1,p.x/d.x)),4,'#f5c66b');}
    if(p.ledge){rect(W/2-225,H-64,450,42,'#152831ef');text('HOLD TOWARD EDGE: CLIMB   /   S: DROP   /   SPACE: KICK',W/2-207,H-39,11,'#f3cc85');}
    if(debug){rect(20,85,285,132,'#11232beF');const lines=[`${p.state.toUpperCase()} | ${w.status}`,`x ${p.x.toFixed(1)}  y ${p.y.toFixed(1)}`,`vx ${p.vx.toFixed(1)}  vy ${p.vy.toFixed(1)}`,`ground ${p.groundId||'—'}  wall ${p.wall}`,`coyote ${p.coyote.toFixed(3)}  buffer ${p.buffer.toFixed(3)}`,`120 Hz | physics ${TUNE.runSpeed} run cap`];lines.forEach((s,i)=>text(s,32,106+i*19,12,'#b8dcc6','monospace'));}
    // Direction marker remains readable when the destination is outside the camera.
    if(d.x>camera.x+W-60){rect(W-142,20,123,30,'#244b45');text('DELIVERY ↗',W-130,40,12,'#fff0c8');}
  };
}
