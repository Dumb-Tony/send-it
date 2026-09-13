import {lab} from './level.js';

function street(id,name,brief,width,extra={}){
  return {id,version:1,name,brief,district:'STREET LEVEL',width,height:1100,
    spawn:{x:70,y:834},parcel:{x:180,y:840,w:22,h:22},
    delivery:{x:width-150,y:782,w:110,h:88},targets:{express:8,sendIt:4.5,unhinged:3.4},stations:[],
    solids:[{id:'floor',x:0,y:870,w:width,h:230},{id:'left',x:-40,y:0,w:40,h:1100},{id:'right',x:width,y:0,w:40,h:1100}],
    slopes:[],conveyors:[],fans:[],movers:[],hazards:[],labels:[],...extra};
}
const first=street('corner-shop','The coffee is getting cold','One flat white. Two blocks. An unreasonable amount of urgency.',1500);
first.solids.push({id:'curb',x:620,y:848,w:110,h:22});
first.labels=[{x:65,y:745,title:'YOUR FIRST SHIFT',sub:'A / D to run · Space to jump · collect the parcel'}, {x:580,y:795,title:'CURB APPEAL',sub:'Run over it, or jump for style.'}];
const slide=street('shutter-run','Under new management','The shop is closing. The shutter is not waiting for you.',1800,{targets:{express:10,sendIt:5.5,unhinged:4.2}});
slide.solids.push({id:'shutter',x:580,y:730,w:260,h:114},{id:'awning',x:1110,y:790,w:200,h:24});
slide.labels=[{x:430,y:680,title:'CLOSING TIME',sub:'Hold S / ↓ before the shutter. Keep running.'},{x:1040,y:735,title:'HIGH ROAD / LOW ROAD',sub:'Stay below, or jump onto the awning.'}];
const belt=street('express-lane','Absolutely no brakes','The warehouse ordered replacement brakes. That seems relevant.',2000,{district:'CONSTRUCTION',targets:{express:9,sendIt:4.5,unhinged:3.2},conveyors:[{id:'belt',x:580,y:856,w:420,h:14,speed:350}],hazards:[{id:'strip',x:1000,y:857,w:95,h:13,name:'Landed in the work zone',hint:'Jump near the end of the belt, before the coral stripes.'}]});
belt.labels=[{x:460,y:760,title:'BORROW SOME SPEED',sub:'Amber machinery moves you.'},{x:870,y:690,title:'JUMP BEFORE THE STRIPES',sub:'Space near the end of the conveyor. Hold for height.'}];
const fan=street('air-mail','Air mail, literally','The rooftop gardener ordered a fan. We found a bigger one.',2100,{district:'CONSTRUCTION',delivery:{x:1850,y:452,w:110,h:88},targets:{express:14,sendIt:8,unhinged:5.5},fans:[{id:'fan',x:850,y:535,w:190,h:335,force:3400}]});
fan.solids.push({id:'roof',x:1100,y:540,w:1000,h:30});
fan.labels=[{x:620,y:750,title:'TAKE THE AIR ROUTE',sub:'Enter the blue updraft. Steer right above the roof.'},{x:1160,y:465,title:'ROOFTOP SERVICE',sub:'A fall is recoverable. Return to the fan.'}];
const shaft=street('scaffold-social','The upstairs neighbour','Third floor. No elevator. “It is only a small bookshelf.”',1900,{district:'CONSTRUCTION',delivery:{x:1680,y:572,w:110,h:88},targets:{express:16,sendIt:9,unhinged:5.2},fans:[{id:'recovery-fan',x:1350,y:590,w:160,h:280,force:3400}]});
shaft.solids.push({id:'wall-a',x:600,y:570,w:50,h:210},{id:'wall-b',x:770,y:630,w:50,h:150},{id:'scaffold',x:820,y:660,w:450,h:24},{id:'recipient-roof',x:1510,y:660,w:390,h:24});
shaft.labels=[{x:460,y:480,title:'THE SHORTCUT GOES UP',sub:'Jump between walls. Press Space again on each contact.'},{x:550,y:820,title:'→ SAFE ROUTE BELOW',sub:'Keep going to the blue fan if the wall climb is tricky.'},{x:1280,y:510,title:'RECOVERY LIFT',sub:'Ride the air up, then steer right.'}];
const skyline={...lab,id:'skyline-shift',version:1,name:'One percent battery',brief:'All that climbing. The customer ordered a phone charger.',district:'SKYLINE',stations:[],targets:{express:35,sendIt:22,unhinged:12}};
export const deliveries=[first,slide,belt,fan,shaft,skyline];
export function medal(time,targets){return time<=targets.unhinged?'UNHINGED':time<=targets.sendIt?'SEND IT':time<=targets.express?'EXPRESS':'DELIVERED';}
export const progressKey='send-it:shift:1';
export function readProgress(storage){
  try{const raw=JSON.parse(storage.getItem(progressKey));const records={};
    for(const l of deliveries){const t=raw?.records?.[l.id];if(Number.isFinite(t)&&t>0)records[l.id]=t;}
    return {records};
  }catch{return {records:{}};}
}
export function unlockedCount(progress){let count=1;while(count<deliveries.length&&progress.records[deliveries[count-1].id])count++;return count;}
export function recordDelivery(progress,level,time){
  if(!deliveries.some(l=>l.id===level.id)||!Number.isFinite(time)||time<=0)return false;
  const previous=progress.records[level.id];if(previous&&previous<=time)return false;
  progress.records[level.id]=time;return true;
}
