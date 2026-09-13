// Presentation only. Every walkable edge still comes from the level's collision data.
const ink='#263c40';
function box(c,x,y,w,h,color,r=0){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
function line(c,x,y,x2,y2,color=ink,width=2){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();}
function circle(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
export function cityBackdrop(c,world,camera,W,H){
  const work=world.level.district==='CONSTRUCTION',skyline=world.level.district==='SKYLINE';
  const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,skyline?'#bdc7d0':'#9bc8ca');sky.addColorStop(.7,'#f1d9b5');sky.addColorStop(1,'#e9bd95');c.fillStyle=sky;c.fillRect(0,0,W,H);
  circle(c,W-195-camera.x*.035,125,66,'#fff0c8');circle(c,W-195-camera.x*.035,125,82,'#fff2cc25');
  c.save();c.translate(-camera.x*.08,0);
  for(let i=0;i<7;i++){const x=i*330-60,y=75+(i%3)*47;box(c,x,y,135,20,'#fff6df90',12);box(c,x+30,y-15,70,30,'#fff6df90',20);}
  c.restore();
  c.save();c.translate(-camera.x*.18,-camera.y*.12);
  for(let i=0;i<20;i++){const x=i*155-50,y=245+(i*71)%140;box(c,x,y,125,700,'#789da080',3);box(c,x+20,y-25,65,25,'#789da080',2);for(let k=0;k<7;k++)box(c,x+20,y+30+k*50,80,5,'#e9dcc650');}
  c.restore();
  c.save();c.translate(-camera.x*.55,-camera.y*.6);
  const colors=['#adaba0','#c8a797','#8eaeaa','#b8b39c'];
  for(let i=0;i<17;i++){
    const x=i*220-80,y=400+(i*47)%105,col=colors[i%4];box(c,x,y,194,740,col,3);box(c,x-5,y,204,12,'#6e878380',2);
    for(let row=0;row<6;row++)for(let k=0;k<3;k++){const wx=x+21+k*55,wy=y+35+row*63;box(c,wx,wy,30,40,'#e7d9b6',3);box(c,wx+3,wy+3,24,33,'#577d7e',2);line(c,wx+15,wy+4,wx+15,wy+34,'#afc3b4',2);}
    if(i%3===0){box(c,x+65,y-53,64,45,'#7a8f89',4);line(c,x+65,y-8,x+60,y,'#7a8f89',4);line(c,x+127,y-8,x+132,y,'#7a8f89',4);}
  }
  c.restore();
  c.save();c.translate(-camera.x,-camera.y);
  for(let i=0;i<Math.ceil(world.level.width/370);i++){
    const x=i*370+12,y=620+(i%3)*30,col=['#cfb29a','#aec0af','#d5bf98'][i%3];
    box(c,x,y,328,250,col,5);box(c,x-6,y-5,340,12,'#7a8b7c',3);
    for(let k=0;k<4;k++){box(c,x+20+k*76,y+25,57,62,'#e5d4b3',3);box(c,x+25+k*76,y+30,47,50,'#557e79',2);line(c,x+48+k*76,y+30,x+48+k*76,y+80,'#b5c7ab',3);}
    box(c,x+20,795,288,75,'#63877d',3);box(c,x+30,803,105,67,'#315e59',2);box(c,x+160,803,136,67,'#47736b',2);
    box(c,x+12,752,304,36,'#ead9b5',3);c.fillStyle='#526b60';c.font='bold 14px Arial';c.fillText(work?['BOLT & CO.','HARD HATS','WORK IN PROGRESS'][i%3]:['DAILY GRIND','PETAL PUSHERS','CORNER GOODS'][i%3],x+35,776);
    for(let k=0;k<10;k++)box(c,x+12+k*30.4,788,30.4,10,k%2?'#e7d3ae':'#c8806b',0);
    // Low-contrast shopfronts are scenery, not obstacles.
  }
  if(work){
    box(c,1130,215,13,655,'#a38660');box(c,785,215,660,12,'#a38660');
    for(let y=245;y<860;y+=55){line(c,1130,y,1143,y+40,'#ddbf87',3);}
    line(c,790,215,1136,128,'#9a8564',4);line(c,1136,128,1440,215,'#9a8564',4);line(c,835,227,835,440,'#8f826a',3);box(c,822,438,28,10,'#8f826a',4);
  }
  c.restore();
}
export function drawCourier(c,p,time,parcel){
  c.save();c.translate(p.x+p.w/2,p.y);c.scale(p.facing,1);
  const crouch=p.h<30,stride=p.grounded?Math.sin(time*23)*3:2,lean=Math.max(-.12,Math.min(.12,p.vx/4000));
  c.transform(1,0,lean,1,0,0);
  // Rounded helmet, scarf, dark trousers and large white trainers.
  if(parcel){box(c,-19,12,12,crouch?10:16,'#263c40',3);box(c,-18,12,11,crouch?8:14,'#e7ac57',2);box(c,-14,12,3,crouch?8:14,'#ffe1a1');}
  const head=crouch?0:1,body=crouch?10:13;
  box(c,-8,body,17,crouch?8:15,ink,5);box(c,-7,body,15,crouch?6:12,'#ed744e',4);
  box(c,-7,head+4,15,10,'#f3c19b',4);box(c,-10,head,20,8,'#fff7df',5);box(c,4,head+5,9,3,'#fff7df',2);box(c,-1,head,4,7,'#e66c4a');circle(c,6,head+9,1.6,ink);
  box(c,-9,head+13,17,4,'#e7b943',2);line(c,-8,head+15,-17-Math.min(9,Math.abs(p.vx)*.02),head+10,'#e7b943',3);
  line(c,-3,body+4,6,body+9,ink,5);line(c,-3,body+4,6,body+9,'#e99069',3);
  const feet=p.h-3;line(c,-4,body+12,-5+stride,feet,ink,5);line(c,5,body+12,6-stride,feet,ink,5);
  box(c,-9+stride,feet-1,10,4,'#fff5dc',2);box(c,2-stride,feet-1,11,4,'#fff5dc',2);
  c.restore();
}
export function drawBay(c,d,parcel){
  box(c,d.x-5,d.y-5,d.w+10,d.h+5,'#263c40',6);box(c,d.x,d.y,d.w,d.h,'#518b71',3);
  box(c,d.x+8,d.y+8,d.w-16,d.h-8,'#204f48',3);box(c,d.x+14,d.y+33,d.w-28,d.h-39,'#a6ce9b30',2);
  c.fillStyle='#fff4d5';c.font='bold 11px Arial';c.fillText(parcel?'DELIVER HERE':'RECIPIENT',d.x+13,d.y+24);
  c.strokeStyle='#a7d78f';c.lineWidth=3;c.setLineDash([4,5]);c.strokeRect(d.x+5,d.y+30,d.w-10,d.h-33);c.setLineDash([]);
  circle(c,d.x+d.w-20,d.y+58,4,'#f4ca75');
  c.fillStyle='#f5d480';c.font='bold 23px Arial';c.fillText('↓',d.x+44,d.y-16);
}
