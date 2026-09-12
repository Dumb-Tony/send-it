# Milestone 1 — Movement laboratory

Status: **started; first playable iteration implemented, feel gate not yet passed.**

## Implemented

- Dependency-free desktop browser build and local HTTP server.
- 120 Hz simulation isolated from presentation, with centralized tuning.
- Acceleration, air steering, variable jumps, coyote time and jump buffering.
- Wall slides/kicks, crouch/slide clearance and low-speed 30 px auto-step.
- Slopes, conveyor acceleration, fan force, piston and moving lift.
- Moving support carry, launch velocity inheritance, hazard/crush detection.
- Seven-station test room with practice warps and recovery floor.
- Parcel pickup, delivery trigger, timer, provisional rankings and local best.
- Immediate R retry, 350 ms automatic death retry, pause and focus handling.
- Telemetry, reduced trails and optional placeholder synthesized sound.
- Full implementation GDD, slice backlog and playtest procedure.

## Verification on 12 September 2026

`node --test tests/*.test.mjs`: **19 tests passed**. Coverage includes jump heights/buffering/release, coyote expiry, speed retention, wall kick, crouch clearance, slope support, conveyor/fan response, platform launch and two full lift cycles, thin hazards, crushing, objective ordering, deterministic reset and station spawn clearance.

In-app browser smoke test: page loaded and Canvas rendered; Space started the timer; Escape showed pause and resumed; station 4 warp showed practice/no-record status at the conveyor; F2 showed telemetry; no warning/error console entries were observed during the smoke test. This is not cross-browser certification or a full manual completion run.

Initial test findings fixed: conveyor and piston practice spawns overlapped their supports; an early jump release could be lost before a buffered jump fired. Regression checks now cover both.

## Remaining before M1 acceptance

1. Complete a standard spawn-to-delivery run and verify all intended alternative/recovery routes in hands-on play.
2. Run the documented 20-minute feel session and tune inertia, air steering, camera and machine phase response from feedback.
3. Decide and implement full low-speed ledge grab/hang/mantle, or deliberately keep the smaller auto-step assist. Current auto-step is not a full ledge system.
4. Expand collision trials for diagonal mover contacts, ramp endpoints and high-speed corner chains. Current headless checks validate specific cases, not every geometry arrangement.
5. Exercise result/personal-best persistence and denied storage end-to-end in the browser; test Chrome/Edge/Firefox independently.
6. Tune rank thresholds from actual runs. Current 45/30/22-second values are placeholders.

No campaign, final art, package modifiers, global leaderboard, GitHub remote or public deployment is included in this first local build. The next production milestone is the 12-delivery Street Level + Construction slice, after the movement gate passes.
