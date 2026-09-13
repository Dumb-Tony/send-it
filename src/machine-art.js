const ink='#2d4c60';
function box(c,x,y,w,h,col,r=0){c.fillStyle=col;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
function line(c,x,y,xx,yy,col,width=2){c.strokeStyle=col;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();}
function bolt(c,x,y){c.fillStyle='#fff2be';c.beginPath();c.arc(x,y,2,0,Math.PI*2);c.fill();}
export function fanHousing(c,f,time){
  const y=f.y+f.h;box(c,f.x,y+4,f.w,48,ink,5);box(c,f.x+4,y+8,f.w-8,40,'#4aa2b4',4);
  for(let k=0;k<3;k++){
    const x=f.x+f.w*(k+.5)/3;c.save();c.translate(x,y+28);c.fillStyle='#204c67';c.beginPath();c.arc(0,0,17,0,Math.PI*2);c.fill();c.rotate(time*7);
    for(let j=0;j<3;j++){c.rotate(Math.PI*2/3);box(c,0,-4,14,8,'#a2dadd',4);}c.restore();bolt(c,x,y+28);
  }
  for(let x=f.x+8;x<f.x+f.w;x+=14)line(c,x,y+8,x,y+48,'#276e86',2);
}
export function beltArt(c,b,time){
  box(c,b.x,b.y,b.w,b.h,ink,5);box(c,b.x+2,b.y+2,b.w-4,b.h-4,'#dbad4a',4);
  c.save();c.beginPath();c.rect(b.x+2,b.y+2,b.w-4,b.h-4);c.clip();
  for(let x=b.x-15;x<b.x+b.w;x+=18){const xx=x+(time*95)%18;line(c,xx,b.y+2,xx+6,b.y+b.h-2,'#795e36',3);}c.restore();
  bolt(c,b.x+7,b.y+b.h/2);bolt(c,b.x+b.w-7,b.y+b.h/2);
}
export function moverArt(c,m,source){
  const bottom=Math.max(source.y,source.y+source.distance)+m.h;
  for(const x of [m.x+15,m.x+m.w-20]){box(c,x,Math.min(source.y,source.y+source.distance),5,Math.abs(source.distance)+m.h,'#587b9035');}
  if(m.kind==='piston'){
    box(c,m.x+30,m.y+m.h,40,Math.max(0,bottom-m.y),ink,3);box(c,m.x+36,m.y+m.h,28,Math.max(0,bottom-m.y),'#91b4c4');box(c,m.x+39,m.y+m.h,5,Math.max(0,bottom-m.y),'#dcebef');
    box(c,m.x+18,bottom-6,m.w-36,28,ink,4);box(c,m.x+22,bottom-2,m.w-44,20,'#d59745',3);
  }
  box(c,m.x,m.y,m.w,m.h,ink,4);box(c,m.x+2,m.y+3,m.w-4,m.h-5,'#efb649',3);box(c,m.x+3,m.y+2,m.w-6,4,'#fff2ab',2);
  bolt(c,m.x+8,m.y+m.h-6);bolt(c,m.x+m.w-8,m.y+m.h-6);
  c.fillStyle=ink;c.font='bold 10px Arial';c.fillText(m.kind==='piston'?'↑ PISTON':'↑ LIFT',m.x+20,m.y+17);
}
