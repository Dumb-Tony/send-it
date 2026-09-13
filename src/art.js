import {roundedPanel} from './toon.js';
import {resident} from './city-life.js';
import {material,insetShadow} from './materials.js';
// Presentation only. Every walkable edge still comes from the level's collision data.
function box(c,x,y,w,h,color,r=0){roundedPanel(c,x,y,w,h,color,Math.max(r,8));}
function circle(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
export {drawCourier} from './courier.js';
export function drawBay(c,d,parcel,time=0){
  box(c,d.x-5,d.y-5,d.w+10,d.h+5,'#263c40',6);box(c,d.x,d.y,d.w,d.h,'#518b71',3);
  box(c,d.x+8,d.y+8,d.w-16,d.h-8,'#204f48',3);box(c,d.x+14,d.y+33,d.w-28,d.h-39,'#a6ce9b30',2);
  material(c,d.x,d.y,d.w,d.h,'wood',.4);insetShadow(c,d.x+8,d.y+8,d.w-16,d.h-8,20);
  c.fillStyle='#fff4d5';c.font='bold 11px Arial';c.fillText(parcel?'DELIVER HERE':'RECIPIENT',d.x+13,d.y+24);
  c.strokeStyle='#a7d78f';c.lineWidth=3;c.setLineDash([4,5]);c.strokeRect(d.x+5,d.y+30,d.w-10,d.h-33);c.setLineDash([]);
  resident(c,d.x+48,d.y+d.h-4,time,'watch',.95);
  circle(c,d.x+d.w-20,d.y+58,4,'#f4ca75');
  c.fillStyle='#f5d480';c.font='bold 23px Arial';c.fillText('↓',d.x+44,d.y-16);
}
