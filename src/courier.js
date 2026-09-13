// A single vector puppet shared by the gameplay sprite and employee portrait.
// All posing is presentation-only; the controller owns the collider and movement.
const INK='#172a40',RIM='#fff3d8',SKIN='#f4b582',ORANGE='#ff6b38';
function stroke(c,points,color,width){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function shape(c,draw,color,rim=true){c.beginPath();draw(c);c.closePath();c.lineJoin='round';if(rim){c.strokeStyle=RIM;c.lineWidth=4;c.stroke();}c.fillStyle=color;c.fill();c.strokeStyle=INK;c.lineWidth=1.5;c.stroke();}
function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function limb(c,points,color,width=3){stroke(c,points,RIM,width+3.4);stroke(c,points,INK,width+1.5);stroke(c,points,color,width);}
function shoe(c,x,y,angle=0){c.save();c.translate(x,y);c.rotate(angle);shape(c,p=>{p.moveTo(-4,-2);p.lineTo(2,-3);p.quadraticCurveTo(3,-1,7,-1);p.quadraticCurveTo(9,0,8,2);p.lineTo(-4,2);},'#fff6e0');stroke(c,[[-3,-1],[-1,-1]],ORANGE,2);stroke(c,[[-3,2],[7,2]],INK,.8);c.restore();}
export function drawCourier(c,p,time,parcel,{landing=0,reducedMotion=false,delivered=false}={}){
  const crouch=p.h<30,hang=!!p.ledge,wall=p.state==='wall slide';
  const run=p.grounded&&Math.abs(p.vx)>25&&!crouch&&!delivered;
  const skid=run&&p.vx*p.facing<-70,air=!p.grounded&&!hang&&!delivered,up=air&&p.vy<0;
  const phase=time*(19+Math.min(9,Math.abs(p.vx)/80)),s=Math.sin(phase),co=Math.cos(phase);
  const breath=reducedMotion?0:Math.sin(time*3.1)*.45;
  const bodyY=crouch?9:14+(run?-Math.abs(co)*1.2:breath)+landing*2;
  const headY=bodyY-14,hipY=crouch?16:25+landing;
  c.save();c.translate(p.x+p.w/2,p.y);c.scale(p.facing,1);
  // Keep the feet planted while shoulders lead the run or lean back during braking.
  const lean=skid?-.2:run?.19:crouch?.12:0;
  c.transform(1,0,-lean,1,lean*p.h,0);
  const backFoot=hang?[-5,p.h-2]:crouch?[-9,p.h-3]:air?[-8,p.h-9]:run?[-4-s*7,p.h-3-Math.max(0,co)*4]:[-6,p.h-3];
  const frontFoot=hang?[5+Math.sin(time*6)*1.5,p.h-3]:crouch?[8,p.h-3]:air?[7,p.h-(up?5:8)]:run?[4+s*7,p.h-3-Math.max(0,-co)*4]:[5,p.h-3];
  const backKnee=crouch?[-5,17]:air?[-8,26]:run?[-6-s*3,30-Math.max(0,co)*4]:[-5,29];
  limb(c,[[-4,hipY],backKnee,backFoot],'#304761',3.4);shoe(c,...backFoot,air?-.35:run?Math.max(0,co)*-.22:0);
  // Blue satchel stays readable independently of the orange jacket.
  shape(c,q=>{q.moveTo(-12,bodyY);q.quadraticCurveTo(-19,bodyY,-18,bodyY+7);q.lineTo(-17,bodyY+13);q.lineTo(-7,bodyY+12);q.lineTo(-7,bodyY+2);},'#3c76b1');
  stroke(c,[[-17,bodyY+5],[-9,bodyY+5]],'#9fc8e0',1.3);oval(c,-12,bodyY+7,1,1,'#fbd976');
  if(parcel){shape(c,q=>{q.moveTo(-23,bodyY+1);q.lineTo(-15,bodyY-1);q.lineTo(-13,bodyY+10);q.lineTo(-22,bodyY+12);},'#d7a05b');stroke(c,[[-19,bodyY+1],[-17,bodyY+10]],'#ffe4a4',2);}
  if(run)limb(c,[[-4,bodyY+3],[-10,bodyY+7],[-10-s*5,bodyY+5+s*4]],'#c54835',2.5);
  // Oversized cropped work jacket, with a curved hem rather than a box body.
  shape(c,q=>{q.moveTo(-6,bodyY-1);q.quadraticCurveTo(3,bodyY-3,7,bodyY+1);q.lineTo(9,hipY-1);q.quadraticCurveTo(1,hipY+3,-9,hipY);q.lineTo(-9,bodyY+4);},ORANGE);
  stroke(c,[[-7,bodyY+5],[-7,hipY-1],[2,hipY]],'#c94335',2);stroke(c,[[2,bodyY+1],[4,hipY-1]],'#ffb16b',1.2);
  stroke(c,[[-5,bodyY],[7,hipY-2]],INK,2.4);stroke(c,[[-5,bodyY],[7,hipY-2]],'#59768b',1);
  oval(c,5,bodyY+4,2.2,2.3,'#fff4d6');stroke(c,[[4,bodyY+5],[6,bodyY+3]],'#ee6439',.8);
  const frontKnee=crouch?[4,16]:air?[8,25]:run?[4+s*3,30-Math.max(0,-co)*4]:[4,29];
  limb(c,[[3,hipY],frontKnee,frontFoot],'#253f5c',3.6);shoe(c,...frontFoot,air?.25:run?Math.max(0,-co)*-.2:0);
  // Scarf tip trails with speed; idle motion is deliberately much quieter.
  const flutter=reducedMotion?0:Math.sin(time*(run?16:4))*1.5,tail=run?24:17;
  shape(c,q=>{q.moveTo(-5,bodyY);q.lineTo(-tail,bodyY-5+flutter);q.lineTo(-tail+3,bodyY);q.lineTo(-tail-1,bodyY+3+flutter);q.lineTo(-4,bodyY+3);},'#ffce45',false);
  // Face has a nose, ear, bright eye and expression, even in the small sprite.
  shape(c,q=>{q.moveTo(-6,headY+5);q.quadraticCurveTo(1,headY+1,7,headY+5);q.lineTo(8,headY+8);q.lineTo(11,headY+10);q.lineTo(8,headY+11);q.quadraticCurveTo(8,headY+15,2,headY+15);q.lineTo(-4,headY+12);q.closePath();},SKIN);
  oval(c,-4,headY+10,2.2,2.7,'#df8c65');stroke(c,[[-4,headY+10],[-3,headY+11]],'#a96550',.7);
  stroke(c,[[-6,headY+5],[-5,headY+9]],'#704b3f',2.7);
  const blink=!reducedMotion&&time%4.8>4.64;
  if(blink)stroke(c,[[3,headY+9],[7,headY+9]],INK,1);
  else{oval(c,5,headY+8.7,2.3,2.5,'#fff9eb');oval(c,6,headY+9,1.25,1.6,INK);}
  stroke(c,[[3,headY+6.2],[6.8,headY+(air&&!up?5.4:6.8)]],INK,1);
  if(air&&!up)oval(c,6,headY+12.5,1.4,1.7,'#803e37');
  else stroke(c,[[3.5,headY+12.2],[5.3,headY+13],[7,headY+12.1]],'#8c4b40',.8);
  // Swept messenger helmet: prominent cream silhouette and orange racing stripe.
  shape(c,q=>{q.moveTo(-9,headY+6);q.bezierCurveTo(-13,headY-4,7,headY-6,10,headY+3);q.lineTo(13,headY+4);q.quadraticCurveTo(14,headY+6,8,headY+6);q.lineTo(-9,headY+6);},'#fff1cf');
  stroke(c,[[1,headY-2],[3,headY+3]],'#f06a36',3.2);stroke(c,[[-7,headY+1],[-4,headY]],'#81969b',1.3);stroke(c,[[-7,headY+3],[-4,headY+2]],'#81969b',1.3);
  stroke(c,[[-9,headY+6],[-4,headY+7],[8,headY+6]],'#c5baa0',1.1);
  // Two articulated arms: pumping elbows, braced slide, reaching fall or ledge grip.
  const hand=delivered?[13,headY+1]:hang?[11,headY+6]:wall?[12,headY+10]:crouch?[12,bodyY+6]:air?[11,headY+(up?10:0)]:run?[8+s*4,bodyY+5-s*4]:[8,bodyY+7];
  const elbow=delivered?[11,bodyY+3]:hang?[7,bodyY-1]:wall?[8,bodyY+3]:crouch?[7,bodyY+4]:air?[9,bodyY+1]:run?[1+s*2,bodyY+8]:[1,bodyY+10];
  limb(c,[[-2,bodyY+3],elbow,hand],ORANGE,3.2);oval(c,...hand,2.1,2.1,SKIN);stroke(c,[[hand[0]-1,hand[1]+1],[hand[0]+1,hand[1]+1]],INK,.7);
  c.restore();
}
