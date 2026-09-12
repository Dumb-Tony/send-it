import { TUNE } from './physics.js';
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
    ctx.clearRect(0,0,W,H);rect(0,0,W,H,'#20323c');
    ctx.save();ctx.translate(-camera.x*.16,-camera.y*.1);
    for(let i=0;i<18;i++){rect(i*155-40,120+(i%3)*65,115,900,'#263a44');rect(i*155-20,145+(i%3)*65,4,22,'#344953');}
    ctx.restore();ctx.save();ctx.translate(-camera.x,-camera.y);
    ctx.strokeStyle='#ffffff06';ctx.lineWidth=1;
    for(let x=0;x<w.level.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,w.level.height);ctx.stroke();}
    for(let y=0;y<w.level.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w.level.width,y);ctx.stroke();}
    for(const f of w.level.fans){
      rect(f.x,f.y,f.w,f.h,'#91c9d21a');
      for(let i=0;i<14;i++){const x=f.x+12+(i*43)%(f.w-24),y=f.y+((i*61-w.time*165)%f.h+f.h)%f.h;text('↑',x,y,23,'#86bdcc65');}
      rect(f.x,862,f.w,8,'#92c3cc');
    }
    for(const b of w.level.solids){rect(b.x,b.y,b.w,b.h,'#53666c');rect(b.x,b.y,b.w,4,'#b5c4c3');rect(b.x,b.y+5,Math.min(5,b.w),b.h-5,'#65777c');}
    for(const s of w.level.slopes){ctx.fillStyle='#53666c';ctx.beginPath();ctx.moveTo(s.x,s.y1);ctx.lineTo(s.x+s.w,s.y2);ctx.lineTo(s.x+s.w,870);ctx.lineTo(s.x,870);ctx.closePath();ctx.fill();ctx.strokeStyle='#c2cecb';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(s.x,s.y1);ctx.lineTo(s.x+s.w,s.y2);ctx.stroke();}
    for(const c of w.level.conveyors){rect(c.x,c.y,c.w,c.h,'#d8ad61');for(let x=c.x+8;x<c.x+c.w-8;x+=24)text('›',x+(w.time*75)%20,c.y+12,18,'#5e4a2d');}
    for(const m of w.machines){
      const source=w.level.movers.find(s=>s.id===m.id);
      ctx.strokeStyle='#d3ab5935';ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(source.x+m.w/2,source.y);ctx.lineTo(source.x+m.w/2,source.y+source.distance);ctx.stroke();ctx.setLineDash([]);
      if(m.kind==='piston'){rect(m.x+35,m.y+m.h,30,870-m.y-m.h,'#8a744b');rect(m.x+44,m.y+m.h,12,870-m.y-m.h,'#c4ad77');}
      rect(m.x,m.y,m.w,m.h,'#e3b966');rect(m.x,m.y,m.w,4,'#ffdf9c');text(m.kind==='piston'?'↑ LAUNCH':'↑ LIFT',m.x+12,m.y+17,10,'#443d2d');
    }
    for(const h of w.level.hazards)stripes(h.x,h.y,h.w,h.h);
    for(const l of w.level.labels){text(l.title,l.x,l.y,13,'#e4e9df');text(l.sub,l.x,l.y+22,11);}
    text('RECOVERY FLOOR  /  A FALL CAN BE A NEW ROUTE',1180,945,16,'#a6b8bb');
    const d=w.level.delivery;
    rect(d.x,d.y,d.w,d.h,'#a6d3aa20');ctx.strokeStyle='#a6d3aa';ctx.lineWidth=2;ctx.strokeRect(d.x,d.y,d.w,d.h);
    text('DELIVERY',d.x+17,d.y+30,14,'#b8e6b7');text('BAY 01',d.x+26,d.y+50,12,'#b8e6b7');text('↓',d.x+44,d.y+76,22,'#b8e6b7');
    if(!w.parcel){const q=w.level.parcel;rect(q.x,q.y,q.w,q.h,'#f3c77a');rect(q.x+9,q.y,4,q.h,'#b2894d');text('PICK UP',q.x-12,q.y-17,10,'#f3c77a');}
    if(resetCamera)trail=[];
    if(!reducedMotion&&Math.abs(p.vx)>420&&w.status==='running'){trail.push({x:p.x,y:p.y,h:p.h});if(trail.length>8)trail.shift();}else trail.shift();
    trail.forEach((v,i)=>{ctx.globalAlpha=i/trail.length*.18;rect(v.x,v.y,p.w,v.h,'#f5c66b');});ctx.globalAlpha=1;
    if(w.status!=='dead'){
      // Readable placeholder courier: helmet, jacket, sneakers and the carried parcel.
      rect(p.x+3,p.y+9,p.w-6,p.h-15,'#f3bf60');rect(p.x+3,p.y,p.w-6,11,'#e9efe8');rect(p.x+(p.facing>0?15:3),p.y+5,6,3,'#20323c');
      const stride=p.grounded&&Math.abs(p.vx)>20?Math.sin(w.time*24)*3:0;
      rect(p.x+2,p.y+p.h-6,8,6+stride,'#e9efe8');rect(p.x+14,p.y+p.h-6,8,6-stride,'#e9efe8');
      if(w.parcel){rect(p.x+(p.facing>0?-7:20),p.y+12,11,14,'#df9361');}
    }else {text('BONK.',p.x-15,p.y-15,20,'#f1a184');}
    if(debug){ctx.strokeStyle='#8fffaa';ctx.strokeRect(p.x,p.y,p.w,p.h);ctx.beginPath();ctx.moveTo(p.x+12,p.y+18);ctx.lineTo(p.x+12+p.vx*.18,p.y+18+p.vy*.18);ctx.stroke();}
    ctx.restore();
    rect(20,20,250,50,'#152831dd');text(w.practice?'PRACTICE / RECORDS OFF':w.parcel?'PARCEL SECURED → DELIVERY BAY':'COLLECT THE PARCEL →',34,41,12,'#f3cc85');text(w.started?'1–7: jump to a lab station':'A / D TO START · SPACE TO JUMP',34,59,10);
    if(debug){rect(20,85,285,132,'#11232beF');const lines=[`${p.state.toUpperCase()} | ${w.status}`,`x ${p.x.toFixed(1)}  y ${p.y.toFixed(1)}`,`vx ${p.vx.toFixed(1)}  vy ${p.vy.toFixed(1)}`,`ground ${p.groundId||'—'}  wall ${p.wall}`,`coyote ${p.coyote.toFixed(3)}  buffer ${p.buffer.toFixed(3)}`,`120 Hz | physics ${TUNE.runSpeed} run cap`];lines.forEach((s,i)=>text(s,32,106+i*19,12,'#b8dcc6','monospace'));}
    // Direction marker remains readable when the destination is outside the camera.
    if(d.x>camera.x+W-60)text('DELIVERY ↗',W-125,38,12,'#b8e6b7');
  };
}
