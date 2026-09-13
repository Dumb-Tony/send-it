// A single vector puppet shared by the gameplay sprite and employee portrait.
// All posing is presentation-only; the controller owns the collider and movement.
const INK='#172a40',RIM='#fff3d8',SKIN='#f4b582',ORANGE='#ff6b38';
function stroke(c,points,color,width){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function shade(c,y,light,mid,dark,height=16){const g=c.createLinearGradient(-8,y,9,y+height);g.addColorStop(0,light);g.addColorStop(.48,mid);g.addColorStop(1,dark);return g;}
function shape(c,draw,color,rim=true){c.beginPath();draw(c);c.closePath();c.lineJoin='round';if(rim){c.strokeStyle=RIM;c.lineWidth=2.5;c.stroke();}c.fillStyle=color;c.fill();c.strokeStyle=INK;c.lineWidth=.85;c.stroke();}
function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function limb(c,points,color,width=5){stroke(c,points,INK,width+1.2);stroke(c,points,color,width);stroke(c,points.map(([x,y])=>[x-.7,y-.6]),'#ffffff24',width*.32);}
function shoe(c,x,y,angle=0){c.save();c.translate(x,y);c.rotate(angle);shape(c,p=>{p.moveTo(-5,-1);p.quadraticCurveTo(-6,-6,0,-5);p.quadraticCurveTo(3,-5,4,-2);p.bezierCurveTo(11,-3,12,2,8,3);p.lineTo(-3,3);p.quadraticCurveTo(-6,3,-5,-1);},shade(c,-5,'#fffdf1','#f2e6c8','#adafbc',8));stroke(c,[[-3,0],[1,0],[3,-1]],'#ff713f',2.2);stroke(c,[[-3,2],[8,2]],'#fff9e5',1.5);stroke(c,[[1,-3],[3,-3]],'#fff',1.2);c.restore();}
export function drawCourier(c,p,time,parcel,{landing=0,reducedMotion=false,delivered=false}={}){
  const crouch=p.h<30,hang=!!p.ledge,wall=p.state==='wall slide';
  const run=p.grounded&&Math.abs(p.vx)>25&&!crouch&&!delivered;
  const skid=run&&p.vx*p.facing<-70,air=!p.grounded&&!hang&&!delivered,up=air&&p.vy<0;
  const phase=time*(19+Math.min(9,Math.abs(p.vx)/80)),s=Math.sin(phase),co=Math.cos(phase);
  const breath=reducedMotion?0:Math.sin(time*3.1)*.45;
  const bodyY=crouch?9:15+(run?-Math.abs(co)*1.4:breath)+landing*2;
  const headY=bodyY-17,hipY=crouch?16:26+landing;
  c.save();c.translate(p.x+p.w/2,p.y);c.scale(p.facing,1);
  // Keep the feet planted while shoulders lead the run or lean back during braking.
  const lean=skid?-.2:run?.19:crouch?.12:0;
  c.transform(1,0,-lean,1,lean*p.h,0);
  const backFoot=hang?[-5,p.h-2]:crouch?[-9,p.h-3]:air?[-8,p.h-9]:run?[-4-s*7,p.h-3-Math.max(0,co)*4]:[-6,p.h-3];
  const frontFoot=hang?[5+Math.sin(time*6)*1.5,p.h-3]:crouch?[8,p.h-3]:air?[7,p.h-(up?5:8)]:run?[4+s*7,p.h-3-Math.max(0,-co)*4]:[5,p.h-3];
  const backKnee=crouch?[-5,17]:air?[-8,26]:run?[-6-s*3,30-Math.max(0,co)*4]:[-5,29];
  limb(c,[[-4,hipY],backKnee,backFoot],'#304761',5.5);shoe(c,...backFoot,air?-.35:run?Math.max(0,co)*-.22:0);
  // Blue satchel stays readable independently of the orange jacket.
  shape(c,q=>{q.moveTo(-12,bodyY-2);q.bezierCurveTo(-23,bodyY-3,-22,bodyY+13,-15,bodyY+14);q.quadraticCurveTo(-7,bodyY+15,-7,bodyY+7);q.quadraticCurveTo(-6,bodyY-1,-12,bodyY-2);},shade(c,bodyY,'#79c9ef','#3685bf','#25446f'));
  stroke(c,[[-17,bodyY+5],[-9,bodyY+5]],'#9fc8e0',1.3);oval(c,-12,bodyY+7,1,1,'#fbd976');
  if(parcel){shape(c,q=>{q.moveTo(-23,bodyY+1);q.lineTo(-15,bodyY-1);q.lineTo(-13,bodyY+10);q.lineTo(-22,bodyY+12);},'#d7a05b');stroke(c,[[-19,bodyY+1],[-17,bodyY+10]],'#ffe4a4',2);}
  if(run)limb(c,[[-4,bodyY+3],[-10,bodyY+7],[-10-s*5,bodyY+5+s*4]],'#c54835',5);
  // Oversized cropped work jacket, with a curved hem rather than a box body.
  shape(c,q=>{q.moveTo(-6,bodyY-2);q.bezierCurveTo(4,bodyY-5,9,bodyY,9,hipY-2);q.quadraticCurveTo(8,hipY+4,-5,hipY+2);q.bezierCurveTo(-14,hipY+1,-13,bodyY,-6,bodyY-2);},shade(c,bodyY-3,'#ffbe70','#ff773d','#bd3935'));
  stroke(c,[[-6,hipY],[3,hipY+1]],'#953c3d',2.4);stroke(c,[[4,bodyY+2],[5,hipY-2]],'#ffd27d',1.1);
  stroke(c,[[-5,bodyY],[7,hipY-2]],INK,2.4);stroke(c,[[-5,bodyY],[7,hipY-2]],'#59768b',1);
  oval(c,5,bodyY+4,2.2,2.3,'#fff4d6');stroke(c,[[4,bodyY+5],[6,bodyY+3]],'#ee6439',.8);
  const frontKnee=crouch?[4,16]:air?[8,25]:run?[4+s*3,30-Math.max(0,-co)*4]:[4,29];
  limb(c,[[3,hipY],frontKnee,frontFoot],'#345375',5.8);shoe(c,...frontFoot,air?.25:run?Math.max(0,-co)*-.2:0);
  // Scarf tip trails with speed; idle motion is deliberately much quieter.
  const flutter=reducedMotion?0:Math.sin(time*(run?16:4))*1.5,tail=run?24:17;
  shape(c,q=>{q.moveTo(-5,bodyY);q.lineTo(-tail,bodyY-5+flutter);q.lineTo(-tail+3,bodyY);q.lineTo(-tail-1,bodyY+3+flutter);q.lineTo(-4,bodyY+3);},'#ffce45',false);
  // Rounded three-quarter face. Broad cheeks and two eyes replace the thin profile.
  shape(c,q=>{q.moveTo(-8,headY+3);q.bezierCurveTo(-4,headY-2,9,headY,10,headY+6);q.bezierCurveTo(13,headY+16,6,headY+20,-2,headY+17);q.bezierCurveTo(-9,headY+15,-11,headY+8,-8,headY+3);},shade(c,headY+2,'#ffe0a6',SKIN,'#cc775b',19));
  oval(c,-7,headY+11,3,3.8,'#ecaa7a');oval(c,-7,headY+11,1.4,2,'#c17a5d');
  stroke(c,[[-8,headY+5],[-6,headY+8]],'#63443c',3.4);
  const blink=!reducedMotion&&time%4.8>4.64;
  for(const [ex,rx] of [[0,2.7],[6.5,2.3]]){if(blink)stroke(c,[[ex-2,headY+9],[ex+2,headY+9]],INK,1.2);else{oval(c,ex,headY+9,rx,3.4,'#fffdf1');oval(c,ex+.8,headY+9.5,1.45,2.2,INK);oval(c,ex+.4,headY+8.7,.55,.7,'#fff');}}
  stroke(c,[[-2,headY+5.5],[1.7,headY+5.8]],'#573d36',1.4);stroke(c,[[5,headY+5.8],[8,headY+5]],'#573d36',1.4);
  oval(c,4.5,headY+12,2.4,1.9,'#dd946b');oval(c,4.1,headY+11.4,1.8,1.1,'#ffd099');
  if(air&&!up)oval(c,4,headY+16,2.1,2.2,'#803e37');
  else{shape(c,q=>{q.moveTo(0,headY+14.5);q.quadraticCurveTo(4,headY+16,8,headY+14);q.quadraticCurveTo(5,headY+20,0,headY+14.5);},'#7b403d',false);stroke(c,[[1,headY+15],[6.5,headY+15.2]],'#fff5db',1.2);}
  // Domed protective helmet with broad light planes, not a flat sticker border.
  shape(c,q=>{q.moveTo(-11,headY+6);q.bezierCurveTo(-17,headY-9,10,headY-12,12,headY+2);q.quadraticCurveTo(16,headY+5,10,headY+6);q.quadraticCurveTo(0,headY+4,-11,headY+6);},shade(c,headY-9,'#ffffed','#f6ddb0','#9e9b97',17));
  stroke(c,[[1,headY-7],[4,headY-5],[6,headY+2]],'#ff773e',3.5);
  stroke(c,[[-9,headY],[ -6,headY-1]],'#526f7a',1.5);
  stroke(c,[[-8,headY-4],[-4,headY-6]],'#fffdf0',1.8);
  // Two articulated arms: pumping elbows, braced slide, reaching fall or ledge grip.
  const hand=delivered?[13,headY+1]:hang?[11,headY+6]:wall?[12,headY+10]:crouch?[12,bodyY+6]:air?[11,headY+(up?10:0)]:run?[8+s*4,bodyY+5-s*4]:[8,bodyY+7];
  const elbow=delivered?[11,bodyY+3]:hang?[7,bodyY-1]:wall?[8,bodyY+3]:crouch?[7,bodyY+4]:air?[9,bodyY+1]:run?[1+s*2,bodyY+8]:[1,bodyY+10];
  limb(c,[[-3,bodyY+3],elbow,hand],shade(c,bodyY,'#ffa65e',ORANGE,'#c64737'),5.5);
  oval(c,...hand,3.7,3.5,INK);oval(c,hand[0]-.3,hand[1]-.4,3.1,2.9,'#fff0ce');oval(c,hand[0]-1,hand[1]-1.3,1.7,1,'#fffdf0');
  c.restore();
}
