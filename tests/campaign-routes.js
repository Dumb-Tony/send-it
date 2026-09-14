import {standardRoute,withJumpReleases} from './routes.js';
export function campaignRoute(index){
  if(index===11)return withJumpReleases(standardRoute());
  let launched=false,aloft=false;
  return withJumpReleases(w=>{
    const p=w.p;
    if(index===0)return {right:true};
    if(index===1)return {right:true,down:p.x>480&&p.x<860};
    if(index===2){const jump=!launched&&p.x>900;if(jump)launched=true;return {right:true,jumpPressed:jump};}
    if(index!==3&&index!==4)return {right:true};
    const target=index===3?930:1420,roof=index===3?540:660;
    if(p.y<roof-75)aloft=true;
    if(aloft)return {right:true};
    return p.x+p.vx*Math.abs(p.vx)/1600<target?{right:true}:{left:true};
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
