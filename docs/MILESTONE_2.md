# Milestone 2 — First Shift

Build 04 / 13 September 2026. The user approved the improved feel and asked to begin turning SEND IT into a full game. This starts campaign production while keeping the outstanding M1 exploratory checks visible. Physics remains lab-0.3; no movement constants changed.

## Playable in this build

- Six-job dispatch board. Complete a delivery to unlock the next; replay completed jobs for better medals. Continue resumes the earliest unfinished job. Final delivery returns to a completed shift board.
- Five new courses: coffee run and curb, closing shutter with slide clearance, boosted warehouse jump, fan-to-rooftop delivery, and scaffold with four-wall-kick upper route or lower recovery fan. The sixth job reuses the proven lab geometry as a machinery capstone, now delivering a phone charger.
- Automatic parcel pickup and delivery, recipient replies, personal bests, three timed medals plus untimed completion, and retry counts per selected job.
- Local save with validation and best-only updates. If storage cannot be written, in-memory progression continues and the result explains the limitation. First Shift uses `send-it:shift:1`; change this campaign version when future physics/geometry makes those records incomparable. Existing lab records remain separate.
- Warm skyline, layered buildings, lamps, construction crane, shutter detailing, clearer destination message and route progress indicator. Decoration does not collide. The character and environment are still simple code-drawn alpha art.
- Playground available from dispatch at any time. Number-key practice warps only work there, never in the campaign.

## Verified routes

| Delivery | Input replay time | Route |
| --- | ---: | --- |
| The coffee is getting cold | 3.325 s | Ground / curb |
| Under new management | 4.100 s | Slide under shutter |
| Absolutely no brakes | 3.108 s | Belt launch over marked hazard |
| Air mail, literally | 5.267 s | Fan to recipient roof |
| The upstairs neighbour | 4.908 s | Lower route / fan |
| The upstairs neighbour | 4.817 s | Four wall kicks / scaffold jump |
| One percent battery | 10.042 s | Original lab lower route / machinery |

These are repeatable regression benchmarks, not claims of optimal speedrun times. Initial medal targets permit learning runs and put the top medal near the tested clean routes. Both completion and records require collecting the parcel.

## Validation and limits

43 headless tests cover all original movement regressions, every campaign delivery from normal spawn, solid penetration during those routes, the scaffold upper transfer, and save validation/unlocks. Browser replays exercise the same simulation and renderer. The session harness drives DOM keyboard events at real speed through the actual game page and checks the first two results, next-job flow and records after reload. Direct browser keyboard checks cover jump and pause. Automated replays do not replace a human feel session or Brave/Firefox/Safari certification.

## Next production work

1. Expand to the planned 12 authored deliveries, especially routes using horizontal movers, ledges and piston chains beyond the reused capstone.
2. More substantial cartoon courier/environment art, animated recipients and authored sound rather than prototype tones.
3. Optional tip detours and secrets, with separately versioned records where needed; cosmetics without physics advantages.
4. More recovery and machine-phase trials, controller support, and cross-browser verification.
5. Medal tuning from player runs. Global leaderboards, accounts, mobile/touch and a seven-district full campaign are not implemented.
