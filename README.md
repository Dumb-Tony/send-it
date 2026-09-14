# SEND IT

A momentum courier platformer. **If there's an address, we deliver.**

**Build 13 / Special Handling:** adds five contract categories across the Rookie Route. Hot deliveries lose freshness after collection; fragile parcels take damage from hard landings and can break; oversized and signature jobs call out their route requirement. Contract type appears on every dispatch card, live package status sits in the HUD, and the result records handling quality.

**Build 12 / Real Routes:** reconstructs the campaign around required mechanics and authored collection points. Parcels may be beyond shutters, on scaffolds and rooftops, or across town; later routes require chained belts, wall kicks, cargo-lift timing and fan transfers. A larger hot-pink parcel with a cream label, dark outline, glow and locator beam stays readable against the illustrated city.

**Build 11 / Rookie Route:** twelve sequential deliveries across two shifts, including six new authored jobs built around awnings, conveyors, cargo lifts, crosswinds and a final mixed-mechanic route. The dispatch board groups both shifts and preserves existing records. Movement remains on the accepted `lab-0.3` tuning.

**Build 08 — courier focus:** rebuilt character silhouette and expressive face, navy/cream outline for background separation, articulated running/jumping/sliding poses, blinking idle, landing compression and delivery celebration. The city and gameplay are unchanged.

**Build 07 / The Rookie:** a more defined courier and portrait, distinct brick/concrete/stucco/metal/wood/fabric/asphalt materials, reflective glass, directional surface lighting, architectural shadows and a courier contact shadow. The update preserves gameplay and saved progress.

**Build 06 / City in Motion:** follows the original concept's illustrated urban-cartoon direction with distinct Street/Construction/Skyline scenery, residents and pigeons, expressive courier poses, functional-looking animated machinery and short movement effects. See [art direction and source notes](docs/ART_DIRECTION.md). Gameplay and existing progress are unchanged.

**Build 05 / Special Delivery — visual pass:** warm paper dispatch slips, postal stripes and stamped branding; illustrated shopfronts and layered city scenery; a rounded helmet-and-scarf courier; solid-edged brick platforms, recipient doors and stronger fan markings. Movement, collision geometry, campaign progression and saved records are unchanged.

**[Play SEND IT](https://dumb-tony.github.io/send-it/)** · [Public source repository](https://github.com/Dumb-Tony/send-it)

The public game is hosted on GitHub Pages and works without a local server. Share that play link with friends. Desktop keyboard controls are required; Brave is expected to work, but has not yet been separately certified.

The Rookie Route is the campaign alpha: twelve short deliveries across Street Level, Construction and the Skyline, with an unlockable dispatch board, recipient messages, local medals and personal bests. The movement playground remains available separately.

The accepted Build 03 physics are unchanged: run, jump, wall-kick, slide, catch slow ledges, borrow conveyor speed and launch from machinery.

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

See [implementation GDD](docs/IMPLEMENTATION_GDD.md), [Rookie Route status](docs/MILESTONE_3.md), and [playtest protocol](docs/PLAYTEST.md). Physics is independent of Canvas and DOM; no local build step is required. Every push to main runs the regression suite and publishes the game through the GitHub Pages workflow. Only game files enter the deployment artifact.

For repeatable visual verification, open `/tests/playtest.html` on the running server. It includes all twelve campaign deliveries, a scaffold wall route, original lab routes and the ledge check. They use ordinary inputs through the same simulation and renderer; they never warp or save records. `/tests/session.html` replays the first two deliveries through the playable page and verifies results, unlocks and persistence after reload. It writes earned progress only on that development origin. These are automated replays, not human feel sessions. Test pages are excluded from deployment.

Build 09 gives the courier and city a shared rounded cartoon treatment: expressive proportions, soft volume, chunky shoes, framed shop signs and readable platform lips. Movement tuning is unchanged.

Build 10 integrates the approved Higgsfield art: a transparent animated courier and illustrated scenery for all three districts. Versioned WebP assets are self-hosted with the game; the closer camera improves readability while preserving movement tuning.
