import {resident,planter,pigeon,tree,van,fireEscape} from './city-life.js';
import {material,surfaceLight,insetShadow,castShadow} from './materials.js';
const ink='#4a6875';
function box(c,x,y,w,h,col,r=0){c.fillStyle=col;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
function line(c,x,y,xx,yy,col=ink,w=2){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();}
function poly(c,points,col){c.fillStyle=col;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function dot(c,x,y,r,col){c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
function window(c,x,y,w=35,h=48){castShadow(c,x-4,y+h+4,w+8,9);box(c,x-3,y-3,w+6,h+6,'#f9e7bc',4);box(c,x,y,w,h,'#547f91',2);const glass=c.createLinearGradient(x,y,x+w,y+h);glass.addColorStop(0,'#23445c');glass.addColorStop(1,'#9ccacf');c.fillStyle=glass;c.fillRect(x,y,w,h);poly(c,[[x+3,y+3],[x+w-3,y+3],[x+3,y+h-3]],'#d3edf04a');line(c,x+w*.7,y+3,x+3,y+h*.7,'#f3fbdf75',2);insetShadow(c,x,y,w,h,7);line(c,x+w/2,y,x+w/2,y+h,'#eadcbc',3);box(c,x-5,y+h, w+10,5,'#647e82',2);}
function cloud(c,x,y,s=1){c.save();c.translate(x,y);c.scale(s,s);box(c,0,0,150,23,'#fffaf0',14);dot(c,42,-2,24,'#fffaf0');dot(c,78,-13,33,'#fffaf0');dot(c,115,0,22,'#fffaf0');c.restore();}
function sign(c,x,y,w,title,col){box(c,x+4,y+5,w,36,'#3b64705c',5);box(c,x,y,w,36,col,5);line(c,x+5,y+4,x+w-5,y+4,'#ffffff70',2);c.fillStyle='#fff5d8';c.font='bold 16px Trebuchet MS';c.fillText(title,x+14,y+24);}
function tower(c,x,y,w,h,col){
  poly(c,[[x+w,y],[x+w+24,y-15],[x+w+24,y+h],[x+w,y+h]],'#708e9b');box(c,x,y,w,h,col,4);box(c,x-6,y-7,w+12,11,'#5e7988',2);
  material(c,x,y,w,h,'concrete',.45);surfaceLight(c,x,y,w,h,.18);insetShadow(c,x,y,w,h,17);
  for(let row=0;row<Math.min(9,Math.floor(h/75));row++)for(let k=0;k<Math.floor(w/58);k++)window(c,x+15+k*58,y+22+row*74,30,43);
}
export function cityBackdrop(c,w,camera,W,H,time=0){
  const construction=w.level.district==='CONSTRUCTION',skyline=w.level.district==='SKYLINE';
  const gradient=c.createLinearGradient(0,0,0,H);gradient.addColorStop(0,skyline?'#629bc7':construction?'#7cbbd4':'#83c7de');gradient.addColorStop(1,skyline?'#d4e8e8':'#fbe5bd');c.fillStyle=gradient;c.fillRect(0,0,W,H);
  dot(c,W-190-camera.x*.025,103,58,'#fff0ac');
  const sun=c.createRadialGradient(W-190,103,45,W-190,103,420);sun.addColorStop(0,'#fff1ba50');sun.addColorStop(1,'#fff1ba00');c.fillStyle=sun;c.fillRect(0,0,W,H);
  c.save();c.translate(-camera.x*.07,-camera.y*.025);for(let i=0;i<6;i++)cloud(c,i*330-60,70+(i%3)*37,.65+(i%2)*.2);c.restore();
  // Far city becomes small and low in the skyline district.
  c.save();c.translate(-camera.x*.13,-camera.y*.12);
  for(let i=0;i<23;i++){
    const x=i*123-50,y=(skyline?520:285)+(i*43)%130,h=skyline?270:850;
    box(c,x,y,103,h,skyline?'#94b7cb':'#9bbcc5',2);box(c,x+20,y-20,56,25,skyline?'#94b7cb':'#9bbcc5',2);
    for(let row=0;row<5;row++)box(c,x+12,y+25+row*40,75,4,'#c9dce0');
  }c.restore();
  if(skyline){
    c.save();c.translate(-camera.x*.34,-camera.y*.2);
    for(let i=0;i<9;i++){const x=i*260-80,y=460+(i%3)*85;tower(c,x,y,120,590,['#9eafbe','#99bcc7','#b9bcc4'][i%3]);line(c,x+60,y-5,x+60,y-65,'#7997ab',3);}
    for(let i=0;i<5;i++)cloud(c,i*330+40,700+(i%2)*60,1.3);
    c.restore();return;
  }
  c.save();c.translate(-camera.x*.45,-camera.y*.5);
  for(let i=0;i<13;i++){
    const x=i*230-60,y=390+(i*53)%120;tower(c,x,y,174,650,['#c0a6aa','#9ebfc0','#d3ba9b','#a9b5c6'][i%4]);
    if(i%3===0)fireEscape(c,x+40,y+90);
    if(i%2===0){box(c,x+44,y-55,68,45,'#718f9c',7);poly(c,[[x+40,y-55],[x+78,y-73],[x+116,y-55]],'#607f90');line(c,x+48,y-10,x+42,y,'#607f90',5);line(c,x+108,y-10,x+114,y,'#607f90',5);}
  }c.restore();
  // Behind the playing plane: these props never acquire collision geometry.
  c.save();c.translate(-camera.x*.82,-camera.y*.88-62);
  if(construction){
    for(let i=0;i<8;i++){
      const x=i*360-50,y=450+(i%3)*60;
      box(c,x,y,280,440,'#b8bcc0');poly(c,[[x+280,y],[x+304,y-16],[x+304,890],[x+280,890]],'#99aab4');
      material(c,x,y,280,440,'concrete');surfaceLight(c,x,y,280,440,.26);
      for(let floor=0;floor<5;floor++){const fy=y+floor*86;box(c,x+12,fy+10,256,65,'#8dabb8');for(let k=0;k<4;k++)box(c,x+16+k*76,fy+5,10,82,'#d4c6a7');box(c,x-8,fy+77,296,10,'#ce9f57');line(c,x,fy+50,x+280,fy+50,'#ddc192',3);}
      for(let floor=0;floor<5;floor++){const fy=y+floor*86;insetShadow(c,x+12,fy+10,256,65,20);material(c,x-8,fy+77,296,10,'wood');}
      resident(c,x+210,y+75,time+i,'worker',.85);resident(c,x+58,y+247,time+i,'lunch',.85);
      sign(c,x+45,y+295,182,['KEEP LOOKING UP','HARD HAT AREA','BOLT & CO.'][i%3],'#b77b4e');
    }
    const x=980;box(c,x,225,18,650,'#d7a655');for(let y=235;y<850;y+=55){line(c,x,y,x+18,y+45,'#a17e54',3);}box(c,x-365,225,680,14,'#d7a655');line(c,x-360,225,x+9,130,'#a18157',4);line(c,x+9,130,x+310,225,'#a18157',4);line(c,x-275,240,x-275,415,'#778a8b',3);c.strokeStyle='#7c8380';c.lineWidth=7;c.beginPath();c.arc(x-269,424,12,0,Math.PI*1.6);c.stroke();
  }else{
    for(let i=0;i<Math.ceil(w.level.width/355)+1;i++){
      const x=i*355-25,y=590+(i%3)*28,col=['#e1a18b','#98b9bc','#d8bf83','#b2a4bf'][i%4];
      poly(c,[[x+316,y],[x+342,y-18],[x+342,887],[x+316,887]],['#bb887f','#779ea7','#b69b6b','#9288a6'][i%4]);box(c,x,y,316,297,col,6);box(c,x-5,y-7,326,12,'#587787',3);line(c,x+4,y+10,x+307,y+10,'#ffe3b8',3);
      material(c,x+1,y+12,314,285,['brick','stucco','concrete','brick'][i%4],i%4===3?.55:1);surfaceLight(c,x,y+5,316,292,.3);insetShadow(c,x,y+5,316,297,22);
      for(let k=0;k<4;k++)window(c,x+24+k*73,y+26,43,57);
      // Residents are framed inside upper windows, safely away from the route.
      resident(c,x+118,y+81,time+i,i%3===0?'water':i%3===1?'watch':'lunch',.75);
      if(i%3===0)planter(c,x+155,y+75);else pigeon(c,x+270,y-8,time+i);
      sign(c,x+16,755,282,['DAILY GRIND  ☕','PETAL PUSHERS','THE CORNER STORE','NOODLE EXPRESS'][i%4],['#c76459','#478d8e','#be8a42','#866893'][i%4]);
      box(c,x+18,805,280,82,'#477684',4);box(c,x+31,814,98,73,'#315d72',3);box(c,x+146,814,137,63,'#77a7b2',3);poly(c,[[x+152,819],[x+232,819],[x+152,872]],'#b9d5d0');
      for(let k=0;k<10;k++)box(c,x+11+k*29.5,791,29.5,18,k%2?'#fff1cf':['#d16f61','#599b9a','#c79552','#92729f'][i%4],3);
      castShadow(c,x+11,809,295,24);material(c,x+11,791,295,18,'fabric');surfaceLight(c,x+11,791,295,18,.25);
      line(c,x+137,806,x+137,887,'#e5c899',5);dot(c,x+116,856,3,'#f7cf7c');
      if(i%3===1){tree(c,x+324,887);planter(c,x+240,882);}if(i%3===2)van(c,x+38,887);
    }
  }
  c.restore();
}
