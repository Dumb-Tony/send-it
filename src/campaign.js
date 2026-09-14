import {lab} from './level.js';

function street(id,name,brief,width,extra={}){
  return {id,version:1,shift:1,name,brief,district:'STREET LEVEL',width,height:1100,
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
const alley=street('alley-express','Mind the paint','The shortcut is freshly painted. The long way is merely inconvenient.',2100,{shift:1,targets:{express:13,sendIt:7,unhinged:5.3}});
alley.solids.push({id:'paint-awning',x:720,y:790,w:330,h:24},{id:'alley-step',x:1230,y:842,w:120,h:28});
alley.slopes.push({id:'loading-ramp',x:1380,y1:870,y2:790,w:220});
alley.labels=[{x:590,y:735,title:'FRESH PAINT',sub:'Slide below or take the awning.'},{x:1320,y:710,title:'LOADING RAMP',sub:'Carry speed through the slope.'}];
const returns=street('return-to-sender','Wrong side of town','Correct address. Wrong side of every fence.',2200,{shift:2,targets:{express:14,sendIt:8,unhinged:5.8}});
returns.solids.push({id:'garden-wall',x:690,y:840,w:150,h:30},{id:'garage-roof',x:1050,y:790,w:300,h:24},{id:'back-step',x:1540,y:842,w:130,h:28});
returns.slopes.push({id:'driveway',x:1680,y1:870,y2:810,w:210});
returns.labels=[{x:570,y:750,title:'RETURN TO SENDER',sub:'The street always offers a way through.'},{x:980,y:735,title:'GARAGE LINE',sub:'Build speed for the upper route.'}];
const lunch=street('lunch-rush','Soup in a hurry','Hot soup. Cobblestones. The lid is more optimistic than we are.',2300,{shift:2,district:'STREET LEVEL',targets:{express:14,sendIt:8,unhinged:5.8},conveyors:[{id:'market-belt',x:520,y:856,w:360,h:14,speed:260},{id:'kitchen-belt',x:1260,y:856,w:300,h:14,speed:300}]});
lunch.solids.push({id:'market-stall',x:930,y:842,w:120,h:28},{id:'cafe-awning',x:1660,y:800,w:270,h:24});
lunch.labels=[{x:430,y:760,title:'LUNCH RUSH',sub:'Two belts. Keep the momentum.'},{x:1580,y:745,title:'TABLE FOR ONE',sub:'The awning is faster if you can reach it.'}];
const hoist=street('hoist-about','Signed for upstairs','The lift works. The stairs also work. Management prefers the lift.',2250,{shift:2,district:'CONSTRUCTION',targets:{express:16,sendIt:9,unhinged:6.2},movers:[{id:'cargo-lift',kind:'lift',x:900,y:820,w:160,h:22,axis:'y',distance:-210,period:3.2},{id:'swing-stage',kind:'lift',x:1370,y:690,w:190,h:22,axis:'x',distance:260,period:4.4}]});
hoist.solids.push({id:'upper-site',x:1620,y:640,w:630,h:28});
hoist.labels=[{x:760,y:735,title:'CLOCK IN',sub:'Ride the lift or stay on the recovery floor.'},{x:1280,y:600,title:'SWING STAGE',sub:'Moving platforms lend their speed.'}];
const vents=street('crosswind','Please close the window','The window is open. The city has taken this personally.',2350,{shift:2,district:'CONSTRUCTION',delivery:{x:2110,y:482,w:110,h:88},targets:{express:17,sendIt:10,unhinged:6.8},fans:[{id:'crosswind-one',x:730,y:590,w:170,h:280,force:3100},{id:'crosswind-two',x:1280,y:510,w:190,h:360,force:3300}]});
vents.solids.push({id:'vent-roof-a',x:920,y:650,w:310,h:24},{id:'vent-roof-b',x:1510,y:570,w:840,h:28});
vents.labels=[{x:600,y:520,title:'CROSSWIND',sub:'Rise, steer, and land on the first roof.'},{x:1200,y:445,title:'SECOND DRAFT',sub:'Commit right when the fan catches you.'}];
const special=street('special-instructions','Special instructions','“Leave by the blue door.” There are six blue doors.',2600,{shift:2,district:'CONSTRUCTION',targets:{express:19,sendIt:11,unhinged:7.4},conveyors:[{id:'final-belt',x:500,y:856,w:400,h:14,speed:320}],fans:[{id:'final-fan',x:1250,y:560,w:170,h:310,force:3300}],movers:[{id:'final-hoist',kind:'piston',x:1720,y:790,w:130,h:24,axis:'y',distance:-190,period:2.8}]});
special.solids.push({id:'final-awning',x:950,y:790,w:240,h:24},{id:'final-roof',x:1450,y:620,w:490,h:26},{id:'final-runout',x:1950,y:760,w:300,h:24});
special.labels=[{x:410,y:745,title:'SPECIAL INSTRUCTIONS',sub:'Belt, awning, fan, hoist. Improvise.'},{x:1600,y:525,title:'LAST COLLECTION',sub:'Ride the machine or take the street.'}];
const skyline={...lab,id:'skyline-shift',version:1,shift:2,name:'One percent battery',brief:'All that climbing. The customer ordered a phone charger.',district:'SKYLINE',stations:[],targets:{express:35,sendIt:22,unhinged:12}};
export const deliveries=[first,slide,belt,fan,shaft,alley,returns,lunch,hoist,vents,special,skyline];
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
