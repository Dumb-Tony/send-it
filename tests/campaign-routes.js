import {standardRoute,withJumpReleases} from './routes.js';
export function campaignRoute(index){
  if(index===11)return withJumpReleases(standardRoute());
  if(index===4)return scaffoldWallRoute();
  if(index===14)return transitWallRoute();
  let launched=false,aloft=false;
  let jumpZone=0,liftStage=0,returning=false;
  return withJumpReleases(w=>{
    const p=w.p;
    if(index===0){const jump=!launched&&p.x>270;if(jump)launched=true;return {right:true,jumpPressed:jump};}
    if(index===1)return {right:true,down:p.x>480&&p.x<860};
    if(index===2){const jump=!launched&&p.x>900;if(jump)launched=true;return {right:true,jumpPressed:jump};}
    if(index===5)return {right:true,down:p.x>480&&p.x<930};
    if(index===6)return w.parcel?{left:true}:{right:true};
    if(index===7){const zones=[800,1480],jump=jumpZone<2&&p.x>zones[jumpZone];if(jump)jumpZone++;return {right:true,jumpPressed:jump};}
    if(index===8){
      if(liftStage===0){
        if(p.x>760&&w.machines[0].y>795){liftStage=1;return {right:true,jumpPressed:true};}
        return p.x>790?{left:true}:{right:true};
      }
      if(liftStage===1){if(p.groundId==='cargo-lift'&&w.machines[0].y<620){liftStage=2;return {right:true,jumpPressed:true};}if(w.machines[0].y<650)return {right:true};return p.x>970?{left:true}:{right:true};}
      if(liftStage===2&&p.groundId==='transfer-beam'){liftStage=3;return {right:true};}
      if(liftStage===3){if(p.groundId==='transfer-beam'&&p.x>1280)return {right:true,jumpPressed:true};if(!p.grounded)liftStage=4;return {right:true};}
      return {right:true};
    }
    if(index===10){
      const jump=!launched&&p.x>820;if(jump)launched=true;
      if(w.parcel&&p.x>1200&&!aloft){if(p.y<610)aloft=true;else return p.x>1340?{left:true}:{right:true};}
      return {right:true,jumpPressed:jump};
    }
    if(index===12){const jump=!launched&&p.x>1370;if(jump)launched=true;return {right:true,down:p.x>550&&p.x<970,jumpPressed:jump};}
    if(index===13){if(p.y<500)aloft=true;if(aloft)return {right:true};const target=p.x<1200?920:1510;return p.x+p.vx*Math.abs(p.vx)/1600<target?{right:true}:{left:true};}
    if(index===15){
      if(w.parcel)returning=true;
      const threshold=returning?[2360,2050,1650][jumpZone-2]:[1330,1680][jumpZone];
      const jump=p.grounded&&(!returning?(jumpZone<2&&p.x>threshold):(jumpZone<5&&p.x<threshold));
      if(jump)jumpZone++;
      return {left:returning,right:!returning,down:p.x>500&&p.x<900,jumpPressed:jump};
    }
    if(index!==3)return {right:true};
    const target=index===3?930:1420,roof=index===3?540:660;
    if(p.y<roof-75)aloft=true;
    if(aloft)return {right:true};
    return p.x+p.vx*Math.abs(p.vx)/1600<target?{right:true}:{left:true};
  });
}
export function transitWallRoute(){
  let climbing=false,exited=false,direction=1;
  return withJumpReleases(w=>{
    const p=w.p;if(exited)return {right:true};
    if(!climbing){if(p.x>690){climbing=true;return {right:true,jumpPressed:true};}return {right:true};}
    if(p.y<570&&p.vx>0){exited=true;return {right:true};}
    if(p.wall){direction=-p.wall;return {left:direction<0,right:direction>0,jumpPressed:true};}
    return {left:direction<0,right:direction>0};
  });
}
export function scaffoldWallRoute(){
  let climbing=false,exited=false,direction=1,launched=false;
  return withJumpReleases(w=>{
    const p=w.p;
    if(exited){const jump=!launched&&p.grounded&&p.groundId==='scaffold'&&p.x>1220;if(jump)launched=true;return {right:true,jumpPressed:jump};}
    if(!climbing){if(p.x>690){climbing=true;return {right:true,jumpPressed:true};}return {right:true};}
    if(p.y<570&&p.vx>0){exited=true;return {right:true};}
    if(p.wall){direction=-p.wall;return {left:direction<0,right:direction>0,jumpPressed:true};}
    return {left:direction<0,right:direction>0};
  });
}
