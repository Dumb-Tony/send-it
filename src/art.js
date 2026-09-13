import {resident} from './city-life.js';
// Presentation only. Every walkable edge still comes from the level's collision data.
const ink='#263c40';
function box(c,x,y,w,h,color,r=0){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
function line(c,x,y,x2,y2,color=ink,width=2){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();}
function circle(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
export function drawCourier(c,p,time,parcel){
  c.save();c.translate(p.x+p.w/2,p.y);c.scale(p.facing,1);
  const crouch=p.h<30,running=p.grounded&&Math.abs(p.vx)>25,hanging=!!p.ledge,wall=p.state==='wall slide';
  const stride=running?Math.sin(time*25)*5:0,lean=running?Math.min(.25,Math.abs(p.vx)/2400):crouch?.2:0;
  const bob=running?Math.abs(Math.sin(time*25))*1.6:!p.grounded?0:Math.sin(time*3)*.65;
  c.translate(0,-bob);c.transform(1,0,-lean,1,lean*p.h,0);
  // Rounded helmet, scarf, dark trousers and large white trainers.
  if(parcel){box(c,-19,12,12,crouch?10:16,'#263c40',3);box(c,-18,12,11,crouch?8:14,'#e7ac57',2);box(c,-14,12,3,crouch?8:14,'#ffe1a1');}
  const head=crouch?0:1,body=crouch?10:13;
  box(c,-9,body-1,19,crouch?9:16,ink,5);box(c,-7,body,15,crouch?6:12,'#f27545',4);box(c,-6,body+3,4,4,'#ffd771',1);
  box(c,-7,head+4,15,10,'#f3c19b',4);box(c,-10,head,20,8,'#fff7df',5);box(c,4,head+5,9,3,'#fff7df',2);box(c,-1,head,4,7,'#e66c4a');circle(c,6,head+9,1.6,ink);
  box(c,-9,head+13,17,4,'#e7b943',2);line(c,-8,head+15,-17-Math.min(9,Math.abs(p.vx)*.02),head+10,'#e7b943',3);
  const armY=hanging?5:wall?10:!p.grounded?(p.vy<0?9:4):body+9+stride*.5;
  line(c,-3,body+4,10,armY,ink,5);line(c,-3,body+4,10,armY,'#f0b087',3);
  const feet=p.h-3,air=!p.grounded&&!hanging,frontY=air?feet-5:feet,backY=hanging?feet:air?feet-9:feet;
  line(c,-4,body+12,-5+stride,backY,ink,5);line(c,5,body+12,6-stride,frontY,ink,5);
  box(c,-10+stride,backY-1,11,5,ink,2);box(c,1-stride,frontY-1,13,5,ink,2);box(c,-9+stride,backY-1,10,3,'#fff5dc',2);box(c,2-stride,frontY-1,11,3,'#fff5dc',2);
  c.restore();
}
export function drawBay(c,d,parcel,time=0){
  box(c,d.x-5,d.y-5,d.w+10,d.h+5,'#263c40',6);box(c,d.x,d.y,d.w,d.h,'#518b71',3);
  box(c,d.x+8,d.y+8,d.w-16,d.h-8,'#204f48',3);box(c,d.x+14,d.y+33,d.w-28,d.h-39,'#a6ce9b30',2);
  c.fillStyle='#fff4d5';c.font='bold 11px Arial';c.fillText(parcel?'DELIVER HERE':'RECIPIENT',d.x+13,d.y+24);
  c.strokeStyle='#a7d78f';c.lineWidth=3;c.setLineDash([4,5]);c.strokeRect(d.x+5,d.y+30,d.w-10,d.h-33);c.setLineDash([]);
  resident(c,d.x+48,d.y+d.h-4,time,'watch',.95);
  circle(c,d.x+d.w-20,d.y+58,4,'#f4ca75');
  c.fillStyle='#f5d480';c.font='bold 23px Arial';c.fillText('↓',d.x+44,d.y-16);
}
