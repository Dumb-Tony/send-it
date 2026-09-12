# Milestone 1 — Movement laboratory

Status: **Build 03; accepted movement tuning retained, ledge assistance and platform departures added.**

## Build 03 — ledges and machinery transfers

The user reported Build 02 felt much better. Ground acceleration, ordinary speed, air acceleration, friction, gravity, jump strength, jump cut and wall-kick tuning are unchanged in this pass.

- A slow descending approach toward a static edge can catch it when the hands are within 10 px of the top and the climb destination is clear. Neutral input holds the ledge. Holding toward it for 120 ms starts a 160 ms vertical-then-horizontal mantle; Down or away drops, and Space wall-kicks out. No extra action button.
- Catching excludes crouching, buffered jumps, upward motion, fast approaches and moving platforms. A fast wall impact cannot immediately become a low-speed catch just because collision removed its velocity. Every mantle step checks solid/hazard clearance.
- Added optional station **8** beside the piston/lift area, reachable with a normal jump from its floor. On-screen hang controls explain climbing, dropping and kicking.
- Stepping off a moving support inherits its velocity once. A late coyote jump preserves upward launch assistance without doubling horizontal speed. Deliberate platform jumps retain their existing behavior.
- Physics is now `lab-0.3`; level data is v3, keeping record categories separate.

Validation: **34 automated tests passed**, including ledge catch/hold/climb, left/right symmetry, drop cooldown, exactly one kick event, headroom rejection, hazards entering a hanging pose, fast/slide/jump priority, input-only station-8 reachability, horizontal platform departures and rising-platform coyote jumps. The original complete delivery and ramp regression checks still pass. Browser verification includes a visibly hanging courier, the mantle transition and `LEDGE CHECK PASSED` at x2342/y708, plus rerunning both full delivery routes. Browser replays do not replace further player feedback on feel.

## Build 02 — route and collision fixes

User playtesting identified an unexplained BONK near the ramp and a wall station that blocked progression. The ramp bug was reproduced with an input sequence: jump on tick 89 while running right; on tick 171 the center-based slope sample lowered the player into the adjacent flat support and the overlap check falsely killed them.

- Keep the collider above a flat support while the trailing foot still overlaps it. Use the post-auto-step height for vertical collision resolution. Static terrain blocks movement rather than producing a lethal crush.
- Lower the second runway lip to the supported auto-step height. Keep the slide tunnel intact.
- Open a 90 px passage beneath both walls, remove the overhanging cap, and make the left wall taller so the fourth alternating kick exits to the right. The wall climb remains a usable optional route, not a progression barrier.
- Move the fan landing to the side of its airflow and remove the lift-deck overlap with the moving lift, opening clear transfers.
- Start the floor hazard after the conveyor's safe surface, label its cause, highlight the impact, and retain a specific hint for 6.5 seconds after automatic retry. Real machinery crushes have a separate explanation. Practice retries return to the chosen station.
- Version physics as `lab-0.2` and level data as v2 so earlier records do not compare with the changed routes.

`tests/routes.js` provides full input-only lower and wall route drivers, including separate jump release/press edges. The same drivers run headlessly and in `tests/playtest.html` using the game's actual physics and renderer. No state teleports, parcel grants or timing changes are used. This catches connected-route failures that isolated unit tests missed. It is automated browser playtesting, not a claim that a human feel session is complete.

## Implemented

- Dependency-free desktop browser build and local HTTP server.
- 120 Hz simulation isolated from presentation, with centralized tuning.
- Acceleration, air steering, variable jumps, coyote time and jump buffering.
- Wall slides/kicks, crouch/slide clearance and low-speed 30 px auto-step.
- Slopes, conveyor acceleration, fan force, piston and moving lift.
- Moving support carry, launch velocity inheritance, hazard/crush detection.
- Eight-station test room with practice warps and recovery floor.
- Parcel pickup, delivery trigger, timer, provisional rankings and local best.
- Immediate R retry, 350 ms automatic death retry, pause and focus handling.
- Telemetry, reduced trails and optional placeholder synthesized sound.
- Full implementation GDD, slice backlog and playtest procedure.

## Verification on 12 September 2026

`node --test tests/*.test.mjs`: **24 tests passed**. Coverage includes the original 19 movement cases, two full spawn-to-delivery routes, the original ramp-death reproduction with penetration checks, 51 run-up jump timings, and specific hazard feedback. Both full routes traverse the slide, conveyor, fan and lift; the wall route requires at least four actual wall kicks. Runs are checked for solid penetration throughout.

Browser playtesting: lower and wall input replays reached the delivery bay. The wall sequence was also inspected in quarter-second steps to verify entry, alternating contacts and the upper exit. In the playable page, actual keyboard jump input at station 4 triggered conveyor travel and a hazard death; the timer reset, the courier returned to station 4, and the specific striped-floor warning remained visible afterward. Initial browser checks also covered Space, Escape and F2. This is not cross-browser certification or a full manual feel session.

Initial test findings fixed: conveyor and piston practice spawns overlapped their supports; an early jump release could be lost before a buffered jump fired. Regression checks now cover both.

## Remaining before M1 acceptance

1. Expand beyond the two verified end-to-end routes to more improvised recovery and machinery chains.
2. Run the documented 20-minute feel session and tune inertia, air steering, camera and machine phase response from feedback.
3. Gather playtest feedback on the new ledge catch window and climb timing, especially near intended wall jumps. Moving-edge hanging remains excluded intentionally.
4. Expand collision trials for diagonal mover contacts, ramp endpoints and high-speed corner chains. Current headless checks validate specific cases, not every geometry arrangement.
5. Exercise result/personal-best persistence and denied storage end-to-end in the browser; test Chrome/Edge/Firefox independently.
6. Tune rank thresholds from actual runs. Current 45/30/22-second values are placeholders.

Public publishing is handled by the Pages workflow in Dumb-Tony/send-it, with the play URL https://dumb-tony.github.io/send-it/. The initial local-only handoff has been superseded by the user's standing public-repository and public-link rule. The campaign, final art, package modifiers and global leaderboard remain future work. The next production milestone is the 12-delivery Street Level + Construction slice, after the movement gate passes.
