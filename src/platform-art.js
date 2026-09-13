import {roundedPanel} from './toon.js';
import {material,insetShadow} from './materials.js';

// Artwork stays inside the existing solid bounds: the bright lip is the landing surface.
export function platformArt(c,b,construction){
  const floor=b.id==='floor',wall=['wall-a','wall-b'].includes(b.id);
  const wood=['scaffold','mid-deck'].includes(b.id),fabric=b.id==='awning',shutter=b.id==='shutter';
  const color=floor?'#4b6479':wall?'#528bb7':shutter?'#629ab6':wood?'#d99346':fabric?'#e97856':construction?'#94a7c2':'#9e8dc2';
  roundedPanel(c,b.x,b.y,b.w,b.h,color,floor?2:5);
  const finish=floor?'asphalt':shutter?'metal':wood?'wood':fabric?'fabric':wall?'brick':'concrete';
  material(c,b.x+3,b.y+10,b.w-6,b.h-13,finish,floor?.22:.45);
  insetShadow(c,b.x+3,b.y+9,b.w-6,b.h-12,10);
  roundedPanel(c,b.x,b.y,b.w,8,floor?'#fff0ca':'#f9e4b7',3);
  if(floor){
    roundedPanel(c,b.x,b.y+8,b.w,12,'#b4bed0',2);
    for(let x=b.x+22;x<b.x+b.w-40;x+=92){roundedPanel(c,x,b.y+67,38,4,'#a0b7ca',2);c.fillStyle='#617992';c.fillRect(x-10,b.y+9,2,10);}
  }else if(wall){
    for(let y=b.y+20;y<b.y+b.h-23;y+=48){roundedPanel(c,b.x+7,y,b.w-14,28,'#274c77',6);roundedPanel(c,b.x+10,y+3,b.w-20,17,'#a5e0e4',4);}
  }else if(shutter){
    for(let y=b.y+12;y<b.y+b.h-5;y+=14)roundedPanel(c,b.x+5,y,b.w-10,8,'#97c3d7',3);
    if(b.w>170){roundedPanel(c,b.x+24,b.y+29,b.w-48,34,'#345778',8);c.fillStyle='#fff0b5';c.font='bold 16px Trebuchet MS';c.fillText('CLOSING TIME',b.x+38,b.y+51);}
  }else if(fabric||wood){
    for(let x=b.x+5;x<b.x+b.w-14;x+=27)roundedPanel(c,x,b.y+10,13,Math.max(2,b.h-14),wood?'#f6c875':'#fff0bf',4);
  }else if(b.w>45&&b.h>20){
    for(const x of [b.x+10,b.x+b.w-10]){c.fillStyle='#3d527b';c.beginPath();c.arc(x,b.y+17,2.5,0,Math.PI*2);c.fill();}
  }
}
