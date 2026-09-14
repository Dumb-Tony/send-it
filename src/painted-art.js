function load(name){
  const image=new Image();image.decoding='async';
  const ready=new Promise(resolve=>{image.onload=()=>resolve(true);image.onerror=()=>resolve(false);});
  image.src=new URL(`./assets/${name}-v10.webp`,import.meta.url).href;
  return {image,ready};
}
export const courierAsset=load('courier');
const districts={STREET:load('street'),CONSTRUCTION:load('construction'),SKYLINE:load('skyline')};
export const artReady=Promise.all([courierAsset.ready,...Object.values(districts).map(a=>a.ready)]);
export function paintedBackdrop(c,w,camera,W,H){
  const transit=w.level.district==='TRANSIT';
  const key=w.level.district==='CONSTRUCTION'?'CONSTRUCTION':w.level.district==='SKYLINE'?'SKYLINE':'STREET';
  const img=districts[key].image;if(!img.complete||!img.naturalWidth)return false;
  const skyline=key==='SKYLINE',height=skyline?H+150:key==='CONSTRUCTION'?760:520;
  const width=height*img.naturalWidth/img.naturalHeight;
  const bottom=skyline?H+150-camera.y*.15:870-camera.y+24;
  c.fillStyle='#baddeb';c.fillRect(0,0,W,H);
  const offset=camera.x*(skyline?.28:.76),first=Math.floor(offset/width);
  for(let i=first;i*width-offset<W;i++){
    const x=i*width-offset;c.save();
    // Alternating reflected tiles share identical pixels at every seam; art contains no text.
    if(i%2){c.translate(x+width,0);c.scale(-1,1);}else c.translate(x,0);
    c.drawImage(img,0,bottom-height,width,height);c.restore();
  }
  // The asphalt is foreground art; this only fills the space below the scenic building bases.
  if(bottom<H){c.fillStyle='#354951';c.fillRect(0,bottom,W,H-bottom);}
  if(transit){
    c.fillStyle='#172b5840';c.fillRect(0,0,W,H);
    c.strokeStyle='#ecbd6b';c.lineWidth=3;c.beginPath();c.moveTo(0,H*.28);c.lineTo(W,H*.22);c.stroke();
    c.strokeStyle='#273d56';c.lineWidth=5;for(let x=-80;x<W+100;x+=240){c.beginPath();c.moveTo(x,H*.18);c.lineTo(x+28,H*.72);c.stroke();}
  }
  return true;
}
