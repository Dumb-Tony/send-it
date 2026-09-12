// Input-only route drivers: never alter the player, objective, time or machine state.
// Also used by the browser playtest page to exercise the shipped simulation/rendering.
export function withJumpReleases(driver){
  let held=false,releaseAt=0,pending=null,tick=0;
  return w=>{
    let input=pending||driver(w);pending=null;
    if(input.jumpPressed){
      if(held){pending={...input};input={...input,jumpPressed:false,jumpReleased:true};held=false;}
      else{held=true;releaseAt=tick+(w.p.wall?20:40);}
    }else if(held&&tick>=releaseAt){input={...input,jumpReleased:true};held=false;}
    tick++;return input;
  };
}
export function standardRoute(){
  let stage=0;
  const steer=(p,target)=>p.x+p.vx*Math.abs(p.vx)/1600<target?{right:true}:{left:true};
  return w=>{
    const p=w.p;
    if(stage===0){if(p.x>1560){stage=1;return {right:true,jumpPressed:true};}return {right:true,down:p.x>700&&p.x<960};}
    if(stage===1){if(p.y<470)stage=2;return steer(p,1840);}
    if(stage===2){if(p.grounded&&p.x>1950)stage=3;return steer(p,2040);}
    if(stage===3){if(p.x>2090){stage=4;return {right:true,jumpPressed:true};}return {right:true};}
    if(stage===4){if(p.grounded&&p.groundId==='lift-deck')stage=5;return steer(p,2430);}
    if(stage===5){if(w.machines[1].y>545){stage=6;return {right:true,jumpPressed:true};}return steer(p,2450);}
    if(stage===6){if(p.grounded&&p.groundId==='lift')stage=7;return steer(p,2570);}
    if(stage===7){if(p.y<370){stage=8;return {right:true,jumpPressed:true};}return steer(p,2570);}
    return {right:true};
  };
}
export function wallRoute(){
  const rest=standardRoute();let climbing=false,finished=false,direction=1;
  return w=>{
    const p=w.p;
    if(finished)return rest(w);
    if(!climbing){if(p.x>1100){climbing=true;return {right:true,jumpPressed:true};}return {right:true,down:p.x>700&&p.x<960};}
    if(p.y<502){finished=true;return {right:true};}
    if(p.wall){direction=-p.wall;return {left:direction<0,right:direction>0,jumpPressed:true};}
    return {left:direction<0,right:direction>0};
  };
}
