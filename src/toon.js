// Shared soft-volume treatment for the city and its oversized machinery.
export function roundedPanel(c,x,y,w,h,color,r=8){
  if(w<=0||h<=0)return;
  const radius=Math.min(r,w/2,h/2);
  c.save();c.beginPath();c.roundRect(x,y,w,h,radius);c.clip();
  c.fillStyle=color;c.fillRect(x,y,w,h);
  const g=c.createLinearGradient(x,y,x+w*.35,y+Math.min(h,100));
  g.addColorStop(0,'#ffffff38');g.addColorStop(.3,'#ffffff08');g.addColorStop(1,'#172d4b32');
  c.fillStyle=g;c.fillRect(x,y,w,h);
  c.strokeStyle='#20395465';c.lineWidth=2;c.stroke();
  if(w>20&&h>12){c.strokeStyle='#fff5da70';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(x+radius+2,y+3);c.lineTo(x+w-radius-2,y+3);c.stroke();}
  c.restore();
}
