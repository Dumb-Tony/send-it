# SEND IT — art direction, Build 06

## Build 07 — character, lighting and materials

The next user-requested pass adds material differences and lighting rather than more level content. The courier is defined as **The Rookie**: cream helmet with stripe/scuffs and chin strap, orange fabric jacket with diagonal messenger strap and small company patch, teal bag, taped cardboard parcel and worn cream trainers. The dispatch portrait uses the same editable character drawing as gameplay.

Materials use cached deterministic 128 px Canvas pattern tiles: staggered brick/mortar, rough stucco, poured concrete with form joints/tie holes, brushed sheet metal, wood boards/grain, fine fabric weave and asphalt aggregate. Patterns are generated once per renderer/context and reused; there are no external texture downloads. Window glass uses a separate reflective gradient and glint treatment.

Lighting follows the existing upper-right sun: warmer lit corners, cooler shaded faces, recessed window/door shadows, cornice shade and leftward awning/sill shadows. A small courier shadow projects onto the nearest eligible solid surface below and fades with height. This is stylized illustration lighting, not a physically simulated lighting system. All effects remain presentation-only; physics, terrain, records and campaign content are unchanged.

Verification: 43 simulation regressions, browser inspection of the character portrait and street materials, complete machinery route replay, and the first-two-deliveries session/persistence check.

## Source of truth

Revisited the original **Game Theme Ideas** conversation on the user's request (conversation `6aa4e3f9-f1bc-83e9-8531-c2794a613f83`). Its section 23 calls for **clean illustrated 2D/2.5D urban cartoon**, strong silhouettes, slightly exaggerated architecture, big readable machinery, bright signage, chunky shapes and smooth animation. The preceding concept describes an expressive messenger with sneakers, helmet and an oversized jacket. Sections 11–12 describe a city that visibly transforms as the courier climbs.

The conversation specifically suggests background people eating lunch, watching from windows, pigeons, workers, apartment residents and someone watering plants. The retained text includes image-search prompts, not actual accessible reference-image attachments; this implementation follows the written direction.

## Build 06 interpretation

- Keep the paper dispatch UI from Build 05; concentrate this pass on the playable scene.
- Move from muted repeated storefronts to brighter coral, teal, ochre and lavender facades, with side faces, window reflections, awnings, rooftop water tanks and fire escapes.
- Street Level: shops, residents, trees, planters, pigeons and a parked courier van.
- Construction: skeletal floors, crane/hook silhouettes, workers and lunch breaks. Background structure has weaker edges than actual platforms.
- Skyline: lower, smaller city shapes and clouds; no ground-level storefront row at rooftop height.
- Environment animation: waving residents/recipients, watering, bird head movement and fan rotors. Reduced-motion mode freezes these decorative loops.
- Courier poses: idle bob, forward run lean, stronger leg cycle, distinct rising/falling arms and tucked legs, wall-slide reach, hanging arms and dangling legs, crouched body.
- Machinery: moving belt treads, circular fan housings, piston cylinders, guide rails, bolts and marked lift plates. Machine motion still uses simulation time.
- Small landing/pickup/death bursts disappear quickly, clear on restart and are disabled with reduced motion. No screen shake or long death sequence.

This pass introduces **no levels, abilities, collision changes, save changes or ranking changes**. All life/props are decorative, drawn behind the actual geometry. Background facades must never be mistaken for guaranteed usable routes; the cream rim/dark edge consistently marks solid platform surfaces.

## Asset ledger

All assets are original, editable Canvas code authored for SEND IT in this project. No external fonts, raster downloads, copied reference artwork or third-party runtime assets.

| File | Responsibility |
| --- | --- |
| `src/district-art.js` | Three district compositions, buildings, signs, background parallax |
| `src/city-life.js` | Residents, workers, plants, birds, vehicle and fire escapes |
| `src/art.js` | Courier poses and recipient bay |
| `src/machine-art.js` | Conveyor, fan and mover presentation |
| `src/render.js` | Composition, physical surfaces, HUD, transient particles |

## Verification

All 43 existing regressions pass. Browser checks cover street, construction and skyline input replays, clean gameplay without telemetry, district contrast, console errors and the slow ledge check. These are automated replays plus visual inspection, not a claim of human feel testing or certification in every browser.
