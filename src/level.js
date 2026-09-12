// World units are pixels. Y increases downward. Every machine phase resets per attempt.
export const lab = {
  id:'movement-lab', version:1, width:3000, height:1100,
  spawn:{x:70,y:834}, parcel:{x:292,y:830,w:22,h:22},
  delivery:{x:2810,y:292,w:110,h:88},
  targets:{express:45,sendIt:30,unhinged:22},
  stations:[{x:70,y:834},{x:570,y:774},{x:1090,y:834},{x:1460,y:820},{x:1820,y:834},{x:2175,y:804},{x:2460,y:584}],
  solids:[
    {id:'floor',x:0,y:870,w:3000,h:230},
    {id:'left',x:-40,y:0,w:40,h:1100},{id:'right',x:3000,y:0,w:40,h:1100},
    {id:'step',x:455,y:842,w:100,h:28},
    {id:'slope-base',x:555,y:810,w:45,h:60},
    {id:'slide-roof',x:770,y:814,w:170,h:30},
    {id:'wall-a',x:1030,y:595,w:50,h:275},{id:'wall-b',x:1200,y:480,w:50,h:300},
    {id:'wall-landing',x:990,y:570,w:90,h:25},
    {id:'mid-deck',x:1250,y:675,w:170,h:24},
    {id:'fan-deck',x:1790,y:525,w:180,h:24},
    {id:'upper',x:2020,y:435,w:130,h:24},
    {id:'lift-deck',x:2390,y:620,w:190,h:25},
    {id:'goal-deck',x:2700,y:380,w:300,h:30}
  ],
  slopes:[{id:'ramp',x:600,w:150,y1:810,y2:870}],
  conveyors:[{id:'belt',x:1430,y:856,w:260,h:14,speed:350}],
  fans:[{id:'fan',x:1780,y:535,w:170,h:335,force:3400}],
  movers:[
    {id:'piston',kind:'piston',x:2160,y:840,w:100,h:25,axis:'y',distance:-320,period:2.8},
    {id:'lift',kind:'lift',x:2520,y:590,w:120,h:22,axis:'y',distance:-260,period:4}
  ],
  hazards:[{id:'pit',x:1650,y:857,w:100,h:13},{id:'crusher',x:2160,y:380,w:100,h:24}],
  labels:[
    {x:65,y:765,title:'01 / BUILD MOMENTUM',sub:'Tap → jog → sprint → SEND IT'},
    {x:555,y:725,title:'02 / SLOPE + SLIDE',sub:'Hold S. Keep the speed.'},
    {x:995,y:415,title:'03 / WALL SHAFT',sub:'Jump against a wall to kick away.'},
    {x:1440,y:750,title:'04 / CONVEYOR',sub:'Borrow some speed.'},
    {x:1770,y:450,title:'05 / FAN',sub:'Air is a route.'},
    {x:2100,y:295,title:'06 / PISTON',sub:'Jump on the upstroke.'},
    {x:2470,y:250,title:'07 / MOVING LIFT',sub:'Ride it. Launch from it.'}
  ]
};
