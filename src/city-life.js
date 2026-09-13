// Decorative residents and props sit behind the collision layer.
import {roundedPanel} from './toon.js';
const dark='#34505b';
function rect(c,x,y,w,h,color,r=0){roundedPanel(c,x,y,w,h,color,Math.max(r,Math.min(9,h*.25)));}
function line(c,x,y,xx,yy,color,width=2){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();}
function dot(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();if(r>5){const g=c.createRadialGradient(x-r*.3,y-r*.4,0,x,y,r);g.addColorStop(0,'#fff6ca35');g.addColorStop(.6,'#ffffff00');g.addColorStop(1,'#213b552b');c.fillStyle=g;c.fill();}}
export function resident(c,x,y,time,kind='watch',scale=1){
  c.save();c.translate(x,y);c.scale(scale,scale);
  const wave=Math.sin(time*2.4),shirt=kind==='worker'?'#edb94b':kind==='water'?'#699ab1':'#c97878';
  line(c,-4,0,-5,-13,dark,5);line(c,6,0,4,-13,dark,5);rect(c,-10,-22,21,15,shirt,5);
  dot(c,1,-29,8,'#f5c99e');rect(c,-7,-37,16,8,kind==='worker'?'#f6cc54':'#514b59',5);dot(c,5,-29,1.2,dark);
  if(kind==='worker'){rect(c,-10,-31,24,3,'#f6cc54',2);line(c,-4,-22,-4,-9,'#fff0a4',2);line(c,5,-22,5,-9,'#fff0a4',2);}
  if(kind==='water'){
    line(c,8,-18,19,-18+wave,'#f5c99e',4);rect(c,15,-17+wave,14,10,'#539ca1',3);line(c,27,-14+wave,35,-9,'#539ca1',3);
    for(let i=0;i<3;i++)dot(c,34+i*3,-7+(time*18+i*5)%13,1,'#9cdddf');
  }else if(kind==='lunch'){
    line(c,8,-18,15,-24+wave,'#f5c99e',4);rect(c,11,-27+wave,11,6,'#f4d787',2);
  }else{
    line(c,9,-19,17,-25,'#f5c99e',4);line(c,17,-25,18+wave*3,-35,'#f5c99e',4);
  }
  c.restore();
}
export function planter(c,x,y){
  rect(c,x,y,40,17,'#ba795e',3);rect(c,x-3,y-3,46,6,'#dd9d77',2);
  for(let k=0;k<3;k++){line(c,x+8+k*12,y,x+5+k*13,y-20,'#507f62',3);dot(c,x+4+k*13,y-17,8,k%2?'#79a568':'#5b9472');dot(c,x+10+k*12,y-24,6,'#82ae73');}
}
export function pigeon(c,x,y,time){
  const bob=Math.sin(time*3)*1.5;line(c,x-2,y,x-2,y-6,'#b67e65',2);line(c,x+4,y,x+4,y-6,'#b67e65',2);
  c.fillStyle='#7996a2';c.beginPath();c.ellipse(x,y-9,9,6,0,0,Math.PI*2);c.fill();dot(c,x+6,y-16+bob,5,'#91a8b2');dot(c,x+8,y-17+bob,1,dark);line(c,x+10,y-14+bob,x+14,y-14+bob,'#d6b47f',2);line(c,x-5,y-9,x+2,y-8,'#486677',3);
}
export function tree(c,x,y){
  line(c,x,y,x-3,y-55,'#867b63',9);line(c,x-3,y-40,x-20,y-58,'#867b63',5);
  dot(c,x-19,y-67,26,'#72a783');dot(c,x+13,y-65,29,'#79ad86');dot(c,x-1,y-88,27,'#8cbb8c');dot(c,x-8,y-96,14,'#a1c991');
}
export function van(c,x,y){
  rect(c,x,y-47,98,42,'#d5a672',7);rect(c,x+69,y-38,52,33,'#d5a672',8);rect(c,x+79,y-34,25,16,'#6f9a9d',4);rect(c,x+7,y-39,50,22,'#e7bc85',3);
  c.fillStyle='#7b705e';c.font='bold 10px Arial';c.fillText('SEND IT',x+12,y-24);dot(c,x+24,y-5,10,'#586769');dot(c,x+97,y-5,10,'#586769');dot(c,x+24,y-5,4,'#aab7a7');dot(c,x+97,y-5,4,'#aab7a7');
}
export function fireEscape(c,x,y){
  for(let row=0;row<3;row++){const by=y+row*64;rect(c,x,by,80,5,'#6d8490',2);line(c,x,by-22,x+80,by-22,'#6d8490',2);for(let k=0;k<7;k++)line(c,x+k*13,by-22,x+k*13,by,'#6d8490',2);line(c,x+7,by+5,x+68,by+64,'#6d8490',4);}
}
