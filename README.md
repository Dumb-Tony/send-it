# SEND IT

A momentum courier platformer. **If there's an address, we deliver.**

**Build 05 / Special Delivery — visual pass:** warm paper dispatch slips, postal stripes and stamped branding; illustrated shopfronts and layered city scenery; a rounded helmet-and-scarf courier; solid-edged brick platforms, recipient doors and stronger fan markings. Movement, collision geometry, campaign progression and saved records are unchanged.

**[Play SEND IT](https://dumb-tony.github.io/send-it/)** · [Public source repository](https://github.com/Dumb-Tony/send-it)

The public game is hosted on GitHub Pages and works without a local server. Share that play link with friends. Desktop keyboard controls are required; Brave is expected to work, but has not yet been separately certified.

**Build 04 / First Shift** is the first campaign alpha: six short deliveries across Street Level, Construction and the Skyline, with an unlockable dispatch board, recipient messages, local medals and personal bests. Five introductory courses lead into a capstone using the original lab course. The movement playground remains available separately.

The accepted Build 03 physics are unchanged: run, jump, wall-kick, slide, catch slow ledges, borrow conveyor speed and launch from machinery. The campaign is a foundation for the planned 12-delivery slice, not the finished full game.

## Run locally

Requires Node.js 20+; there are no packages to install.

```powershell
cd C:\GPT_DEV\send-it
node scripts/serve.mjs
```

Open http://127.0.0.1:4173 in a desktop browser. If the port is occupied, set `$env:PORT = '4174'` before running the server. ES modules need HTTP; do not double-click the HTML file.

## Controls

| Key | Action |
| --- | --- |
| A/D or Left/Right | Move |
| Space | Jump / wall jump; release for a shorter jump |
| S or Down | Slide / crouch |
| R | Immediate retry |
| Escape | Pause |
| F2 | Physics telemetry |
| 1–8 | Playground only: select a practice station; records disabled |

**Station 8 tests ledges:** approach slowly while falling, hold toward the edge to climb, Down to drop, or Space to kick away. Fast approaches and slide input bypass the catch.

The timer starts with movement. Death retries after 350 ms. Campaign progress saves to this browser under the First Shift version; playground records retain their physics/level keys. No account or cross-device synchronization. Medal targets are initial benchmarks based on verified routes. Sound is opt-in; reduced motion follows the system preference and can be changed below the game. No touch controls yet.

## Test

```powershell
node --test tests/*.test.mjs
```

See [implementation GDD](docs/IMPLEMENTATION_GDD.md), [First Shift status](docs/MILESTONE_2.md), and [playtest protocol](docs/PLAYTEST.md). Physics is independent of Canvas and DOM; no local build step is required. Every push to main runs the regression suite and publishes the game through the GitHub Pages workflow. Only game files enter the deployment artifact.

For repeatable visual verification, open `/tests/playtest.html` on the running server. It includes all six campaign deliveries, a scaffold wall route, original lab routes and the ledge check. They use ordinary inputs through the same simulation and renderer; they never warp or save records. `/tests/session.html` replays the first two deliveries through the playable page and verifies results, unlocks and persistence after reload. It writes earned progress only on that development origin. These are automated replays, not human feel sessions. Test pages are excluded from deployment.
