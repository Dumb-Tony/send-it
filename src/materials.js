// Small reusable material tiles: deterministic, generated once per canvas context.
const caches=new WeakMap();
function tile(ctx,type){
  let cache=caches.get(ctx);if(!cache){cache=new Map();caches.set(ctx,cache);}if(cache.has(type))return cache.get(type);
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const c=canvas.getContext('2d');
  let seed=741;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  c.lineWidth=1;
  if(type==='brick'){
    for(let row=0;row<8;row++){const y=row*16;c.fillStyle='#ffeac740';c.fillRect(0,y,128,2);for(let x=(row%2)*24-48;x<128;x+=48){c.fillStyle='#ffeac740';c.fillRect(x,y,2,16);c.fillStyle=`rgba(69,38,33,${random()*.14})`;c.fillRect(x+2,y+3,44,11);c.fillStyle='#fff6df25';c.fillRect(x+5,y+4,17,1);}}
  }else if(type==='concrete'||type==='stucco'||type==='asphalt'){
    const count=type==='asphalt'?900:type==='stucco'?560:230;
    for(let i=0;i<count;i++){const x=random()*128,y=random()*128;c.fillStyle=i%2?'#fff5da28':'#20374325';const size=type==='asphalt'?1.8:1;c.fillRect(x,y,size,random()*2+1);}
    if(type==='concrete'){c.strokeStyle='#293f452b';c.strokeRect(.5,.5,127,63);c.strokeRect(.5,64.5,127,63);for(const y of [8,55,72,119]){c.fillStyle='#31434b35';c.beginPath();c.arc(9,y,2,0,Math.PI*2);c.fill();c.beginPath();c.arc(118,y,2,0,Math.PI*2);c.fill();}}
  }else if(type==='metal'){
    for(let i=0;i<85;i++){c.fillStyle=i%2?'#ecf9ff28':'#203b521b';c.fillRect(random()*128,random()*128,10+random()*65,1);}
    c.fillStyle='#21394a26';c.fillRect(0,0,128,2);c.fillRect(0,0,2,128);
  }else if(type==='wood'){
    for(let y=0;y<128;y+=16){c.fillStyle='#3d302340';c.fillRect(0,y,128,2);for(let k=0;k<3;k++){c.strokeStyle='#442b222c';c.beginPath();for(let x=0;x<=128;x+=4){const yy=y+4+k*4+Math.sin(x*.09+y)*1.4;x?c.lineTo(x,yy):c.moveTo(x,yy);}c.stroke();}}
    c.strokeStyle='#50342940';c.beginPath();c.ellipse(43,41,9,3,0,0,Math.PI*2);c.stroke();
  }else if(type==='fabric'){
    c.fillStyle='#fff4d329';for(let x=0;x<128;x+=3)c.fillRect(x,0,1,128);c.fillStyle='#283a4420';for(let y=0;y<128;y+=4)c.fillRect(0,y,128,1);
  }
  const pattern=ctx.createPattern(canvas,'repeat');cache.set(type,pattern);return pattern;
}
export function material(c,x,y,w,h,type,opacity=1){if(w<=0||h<=0)return;c.save();c.globalAlpha=opacity;c.fillStyle=tile(c,type);c.fillRect(x,y,w,h);c.restore();}
export function surfaceLight(c,x,y,w,h,strength=.22){
  if(w<=0||h<=0)return;const light=c.createLinearGradient(x,y+h,x+w,y);light.addColorStop(0,`rgba(24,44,66,${strength})`);light.addColorStop(.58,'rgba(30,49,67,0)');light.addColorStop(1,`rgba(255,239,183,${strength})`);c.fillStyle=light;c.fillRect(x,y,w,h);
}
export function insetShadow(c,x,y,w,h,depth=8){const g=c.createLinearGradient(x,y,x,y+depth);g.addColorStop(0,'#20344365');g.addColorStop(1,'#20344300');c.fillStyle=g;c.fillRect(x,y,w,Math.min(depth,h));}
export function castShadow(c,x,y,w,drop=12){c.fillStyle='#263d5540';c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.lineTo(x+w-drop*.6,y+drop);c.lineTo(x-drop*.6,y+drop);c.closePath();c.fill();}
