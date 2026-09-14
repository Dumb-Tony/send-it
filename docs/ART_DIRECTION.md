# SEND IT — art direction, Build 06

## Build 08 — courier only

The user explicitly requested focus on the courier, one thing at a time. No environment art, materials, level content or physics changed. `src/courier.js` replaces the former box-based figure with an articulated vector character shared by gameplay and the existing employee portrait.

Silhouette: swept cream messenger helmet, dark navy contour with a narrow cream separation rim, blue satchel, orange curved jacket, scarf and oversized sneakers. Face: nose/chin/ear profile, white eye with pupil, eyebrow, grin and open-mouth fall expression. Poses: planted breathing/blinking idle; pumping elbows and bent-knee run; backward skid lean; rising and falling reach; crouched slide; wall brace; ledge grip with dangling legs; short landing compression; delivery fist raised. Animation never changes the collider or simulation values.

`tests/courier.html` is a local-only pose review displaying eight states enlarged and at gameplay scale against multiple background colors. Existing browser route/ledge replays and the 43 simulation regressions remain the verification path. No new gameplay feature is included in this release.

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

## Build 09 — rounded cartoon direction

The user's style reference is Subway Surfers: bold, cartoony, rounded. It is a broad shape and shading reference, not a character or asset copy (official reference: https://subwaysurfers.com/). SEND IT retains its courier helmet, work jacket, scarf and messenger bag.

Courier: larger domed helmet and three-quarter face, two large eyes, full cheeks, chunky sleeves/trousers, cream gloves and oversized trainers. Soft directional gradients give volume while the light silhouette edge separates him from the city. Existing state-driven poses remain.

Level: shared rounded-panel rendering, cream-framed rounded windows, pill-shaped shop signs, shaded vehicles/planters, softer city surfaces, rounded machinery housings, and distinct wood/fabric/metal/brick patterns at lower visual noise. Walkable platform tops retain their exact collision positions. District identity and existing movement/geometry are preserved.

Source: original Canvas vector artwork in courier.js, toon.js and platform-art.js, with matching updates to the district, city-life, machinery and recipient artwork. No third-party assets were copied.

## Build 10 — approved Higgsfield artwork in the game

The user approved Higgsfield concept job `0a53b5c5-29d4-4a3e-b5f1-b9bfc494cbeb`. That image was supplied as the reference for a transparent sixteen-pose courier atlas and separate Street, Construction and Skyline scenery. Actual generated pixels now render in the game, rather than being approximated with vector shapes.

`docs/HIGGSFIELD_ASSETS.json` records the complete prompts, model, reference and job IDs. Runtime assets are versioned WebP files under `src/assets/`; source PNGs are retained locally in ignored `artifacts/source-art/`. `scripts/prepare-art.cjs` converts them with sharp and measures connected alpha bounds so poses crossing the nominal grid do not lose shoes or hands. Total runtime artwork is approximately 2.5 MB.

The controller selects eight running frames, idle with gentle breathing, jumping, falling, sliding, wall bracing, ledge hanging, landing and celebrating. A small gold tag indicates the parcel. The portrait redraws when the atlas loads. Existing vector art remains a loading/error fallback. Scenery repeats in reflected tiles without text seams; interactive platforms, machinery, hazards and delivery markers remain foreground graphics at the original collision coordinates. Camera magnification is 1.2; physics and level layouts are unchanged.
