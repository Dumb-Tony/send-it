# SEND IT

A momentum courier platformer. **If there's an address, we deliver.**

This is the first **Milestone 1 movement laboratory**, not the finished campaign. Run, jump, wall-kick, slide, build slope/conveyor speed, ride lifts, and launch from a piston. Collect the parcel and reach the green delivery bay. A lower floor supports recovery and route experiments.

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
| 1–7 | Teleport to a lab station; records disabled |

The timer starts with movement. Death retries after 350 ms. Personal bests are saved locally and keyed by physics and level version. Lab rank targets are provisional. Sound is opt-in; reduced motion follows the system preference and can be changed below the game. No touch controls yet.

## Test

```powershell
node --test tests/*.test.mjs
```

See [implementation GDD](docs/IMPLEMENTATION_GDD.md), [milestone status](docs/MILESTONE_1.md), and [playtest protocol](docs/PLAYTEST.md). Physics is independent of Canvas and DOM; no build step is required. Static asset URLs are relative for eventual GitHub Pages hosting. No remote is configured by this scaffold.
