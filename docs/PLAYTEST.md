# Movement lab playtest

Use a desktop browser at 100% zoom. Turn on F2 when investigating contact behavior. The room is for tuning; 1–7 warps are deliberately unranked.

Before delivering a movement or layout change, run the automated tests **and** open `/tests/playtest.html` on the local server. Play both complete input replays in the browser and inspect the changed station with Pause / Advance ¼ second. Then check the actual game's keyboard input, death feedback and retry. A smoke test that only loads the page is not sufficient. Replays prove route reachability; they do not replace movement-feel feedback.

1. **Three minutes: runway.** Tap and hold movement, reverse, stop, short-hop and full jump. Does acceleration feel intentional? Does air control preserve commitment?
2. **Three minutes: walls.** Use station 3. Steer into each wall and kick repeatedly with separate jump presses. Test buffered jumps and late edge jumps. Log sticky corners and unexpected speed loss.
3. **Three minutes: slide and slope.** Station 2. Descend the ramp, hold S through the low passage, release under the ceiling, reverse uphill. Standing must wait for clearance. The low lip should step automatically at ordinary speed.
4. **Five minutes: machines.** Stations 4–7. Compare ordinary versus conveyor takeoff. Enter/leave fan edges. Stand still on the lift for a whole cycle. Jump from the piston at different phases. Watch for jitter, lost support and repeated launch inheritance.
5. **Six minutes: free routing.** Restart normally, collect the parcel and deliver it. Try a different path. Missing a jump onto the lower floor should allow recovery. Note whether you want to retry without being prompted.

Check R during movement, death and results. Check blur/pause, resume, repeated retry, refresh/personal best, reduced motion and optional sound. A warp run must not replace a standard record. Timer and machine phase reset together. Coral stripes are lethal; amber machine tops are supports.

Feedback template: build commit / browser / station / attempted action / expected outcome / actual outcome / reproducibility / optional recording. Separate mechanical bugs from feel preferences. Do not accept M1 until both stable behavior and the 20-minute enjoyment test pass.
