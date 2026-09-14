# SEND IT — Implementation Game Design Document

Version 0.4 • 13 September 2026 • Working implementation specification

Build status: the user approved the improved movement and requested full-game development. **First Shift**, the initial six-delivery campaign alpha, is now implemented with local progression, medals and a dispatch board; see [Milestone 2](MILESTONE_2.md). Five new courses lead into a capstone that reuses the lab geometry. The original 12-delivery slice remains the next content target; the full-game systems below remain specifications unless explicitly marked implemented. Accepted movement constants are unchanged.

**A momentum platformer about getting a package where it absolutely should not be possible to deliver.**

Source: the previous ChatGPT conversation **Game Theme Ideas**, conversation ID `6aa4e3f9-f1bc-83e9-8531-c2794a613f83`, especially its SEND IT concept expansion and local-development handoff. This document translates that concept into buildable systems. Numeric physics values, technical architecture, level names, budgets, and release gates below are implementation decisions, not previously approved playtest results. Source inspiration is N's movement philosophy; all characters, levels, code, presentation and branding must be original.

## 1. Product definition and commandments

SEND IT is a single-player, side-view, momentum-driven courier game for desktop browsers. The player climbs a playful, increasingly vertical city by treating everyday objects and dangerous machinery as parkour tools. Each compact delivery offers a legible beginner route, a faster skill route, and room for unexpected routing. The destination is understandable; the route is negotiable.

1. Movement is the game.
2. The environment provides abilities.
3. Consider every hazard as a potential tool.
4. Levels are playgrounds, not hallways.
5. Failure restarts nearly instantly.
6. Beginners can finish; experts can break the level.
7. Movement readability takes priority over visual spectacle.
8. New mechanics interact with old mechanics.
9. Cosmetics never alter competitive physics.
10. Question any feature that does not make movement more fun.

The fantasy is childlike route invention in an ordinary world, not literal lava everywhere. A dumpster becomes a springboard, a train becomes transport, and a crusher's safe upper surface becomes an elevator. The company motto is **If there's an address, we deliver.** The city is welcoming and absurd rather than grim or generically neon. The eventual final recipient at the skyline ordered a phone charger.

**Primary test:** would someone willingly spend 20 minutes jumping around the movement room without rewards? Until that answer is yes, campaign production is premature.

## 2. Scope and platform

Initial target: keyboard on desktop Chrome, Edge and Firefox; validate Safari before claiming support. Static HTTP hosting, including GitHub Pages, is the intended distribution. The game has no server dependency for local play. A downloadable desktop wrapper is an evaluation after browser release, not a requirement. Touch controls and mobile certification are deferred. Responsive page layout alone does not imply touch support.

Milestone 1 is one movement laboratory: character, platforms, walls, slopes, slide passage, conveyor, fan, piston, moving platform, hazard, parcel, destination, timer, restart and telemetry. Simple geometric artwork is deliberate. No campaign, shop, giant city, online account system or elaborate menu belongs in this milestone.

Milestone 2 is a **12-delivery vertical slice across Street Level and Construction**, within the source's 10–15-level range. It adds delivery presentation, art, audio, local progression, rankings, alternate routes and secrets after the movement gate passes. Seven districts and 100+ deliveries are long-term possibilities, not a promise or current production quota.

## 3. Core loops

Moment to moment: read geometry → build or redirect momentum → jump, slide or ride a machine → recover or land → continue. No double jump, magic dash, teleport, grapple button, combat, inventory management or stat upgrades.

Delivery: spawn → optionally collect parcel → reach recipient → immediate result → retry or next delivery. Most missions have one parcel and recipient. Start-carrying and chained deliveries become data-driven variations later. Automatic pickup and delivery require overlap; no interaction key or forced stop animation. A result can freeze the successful attempt but must immediately accept retry.

Mastery: finish → improve route → earn Express → earn Send It → chase personal best, hidden Unhinged target or ghost. Optional tip tokens tempt detours and fund cosmetics; collecting them is never mandatory for a standard delivery. Separate completion and all-tips records prevent collectibles from making the main speed board ambiguous.

Long-term: climb districts, discover optional Black Label deliveries, personalize the courier, return for authored daily or weekly challenges. Recurrence is optional replay value, not an energy system, login streak or lost reward penalty.

## 4. Controls and input semantics

| Input | Action | Rules |
| --- | --- | --- |
| A/D or Left/Right | Run / air steer | Acceleration, not immediate fixed velocity |
| Space | Jump / wall jump | Press edge buffered; release cuts upward speed |
| S or Down | Crouch / slide | Feet stay fixed when collider changes; blocked ceiling prevents standing |
| R | Restart | Immediate, no confirmation, resets all machine phases and run clock |
| Escape | Pause | Clear held inputs to prevent stuck motion |
| F2 | Telemetry | Lab developer overlay only |
| 1–8 | Lab station | Practice mode; disqualifies record saving |

Input is captured independently of simulation. Consume edge events once per physics tick, not once per rendered frame. Ignore keyboard auto-repeat for jump presses. On blur or hidden tab, pause and clear held input; require deliberate resume. Interactive page controls retain normal keyboard operation. Controller support in the slice should map left stick/D-pad, south button jump and down/shoulder slide, with remapping in accessibility settings. Keyboard remains the M1 acceptance path.

## 5. Movement model

Coordinates use world pixels, positive Y downward, velocities in px/s. Simulation runs at **120 fixed ticks/second**. The render loop accumulates elapsed time, caps catch-up work and never treats a long hidden-tab gap as a giant physics step. Rendering and the camera cannot change physics outcomes. Timer is simulated active ticks, not animation frames.

Initial tuning, all centralized in `src/physics.js`:

| Parameter | Initial value | Intent |
| --- | ---: | --- |
| Standing collider | 24 × 36 px | Small readable courier |
| Crouching height | 22 px | Slide passage clearance |
| Ground acceleration | 1,900 px/s² | About 0.21 s to ordinary run speed |
| Air acceleration | 800 px/s² | Correctable jumps with meaningful commitment |
| Ordinary run speed | 390 px/s | Input target, not a clamp on boosts |
| Emergency horizontal cap | 1,100 px/s | Numerical guard for initial collision envelope |
| Ground deceleration | 1,550 px/s² | Responsive stops |
| Slide deceleration | 85 px/s² | Retain momentum while crouched |
| Air deceleration | 45 px/s² | Preserve speed in flight |
| Gravity | 1,850 px/s² | Clear jump arc |
| Initial jump speed | 620 px/s upward | Approx. 104 px uncut ballistic rise |
| Jump release multiplier | 0.48 | Short-hop control |
| Maximum fall speed | 1,150 px/s | Bounded collision speed |
| Wall-slide fall cap | 150 px/s | Applies while steering into wall |
| Wall-jump outward speed | At least 440 px/s | Reliable clearance |
| Wall steering lock | 0.13 s | Prevent immediate cancellation |
| Coyote time | 90 ms | Forgiving edge jumps |
| Jump buffer | 120 ms | Forgiving pre-landing input |
| Slope acceleration factor | 1,100 px/s² × gradient | Downhill builds speed, uphill spends it |

These are starting hypotheses. Measure short/full jump apex, run-up distance, braking distance, wall-jump height and machine launches in the lab. Record changes with a physics version. Do not silently change previously ranked physics.

### Movement states and priorities

States are idle, run, crouch/slide, rising, falling, wall slide, later ledge hang/mantle, dead and delivered. Resolve restart/pause before simulation. Within a tick: update machine phase → carry support displacement → update input buffers and crouch clearance → accelerate → resolve jump → apply gravity/fields → integrate and collide → update contacts → evaluate hazard, pickup and delivery → emit presentation events.

Grounded and wall contacts are geometric results, not animation states. Ground jump spends coyote time. Wall jump requires actual contact and an independent press; same-wall climbing may be allowed if repeated movement remains skillful, but never create unlimited buffered kicks from one held key. Wall impulses preserve useful speed and always push away. Jump release only affects upward motion. Input acceleration must not snap conveyor or platform boosts back to ordinary run speed.

Slide changes friction and collider; standing requires free headroom. Build 03 adds a low-speed static ledge catch alongside the existing 30 px auto-step. Catch only while descending below 260 px/s, approaching at no more than 180 px/s, holding toward the wall, and with hands within 10 px of its top. Reject blocked standing clearance, crouching, buffered jump or recent high-speed wall contact. Neutral input holds the catch; holding toward the edge for 120 ms starts a collision-checked 160 ms mantle, Down/away drops, and Space kicks outward. This choice preserves jump as the wall-kick action rather than introducing a second jump meaning. Moving ledges are excluded for this iteration. The original running/jumping constants remain unchanged from the user-approved Build 02 baseline.

### Slopes, collision and moving geometry

Use explicit line-segment surfaces for initial ramps, rectangle solids for walls/floors, and dedicated movers. Sample ramp height beneath the courier center; snap downward only when already supported or crossing from above. Never teleport a player through a ramp from underneath. Downhill acceleration preserves launch speed; uphill loses energy. Follow-up work should project launch direction along the slope tangent if playtests show the horizontal-velocity approximation is insufficient.

Integration subdivides a fixed tick into spatial steps no larger than 6 px to prevent tunneling through current thin geometry. Resolve axis contacts and slope top surfaces, preserving adjacent flat support at seams. Only moving machinery can cause a crush; static overlap must be resolved without killing the courier. A future broadphase can use a spatial hash after profiling; the laboratory uses bounded arrays. Test corners, seams, ceilings, slope endpoints, competing contacts and both travel directions. Require complete input-only route tests and browser replay inspection for movement/layout changes, not just isolated component tests.

Movers use deterministic time functions. Standing riders inherit displacement. Jumping inherits horizontal platform velocity and upward vertical velocity once. Walking off inherits platform motion once as well; a coyote jump preserves upward assistance without reapplying horizontal velocity. An upward machine that reaches a player can lift them; a trapped player dies. The initial sinusoidal piston is a launch test, not final industrial animation. Final machinery should expose wind-up, active and recovery phases, with visuals and sound derived from the same phase data.

## 6. Machinery contracts

| Object | Beginner interpretation | Expert use | Implementation / test requirement |
| --- | --- | --- | --- |
| Conveyor | Moving floor | Speed source | Surface acceleration; speed survives takeoff |
| Fan | Air obstacle | Vertical route | Bounded force volume; stable entry and exit |
| Piston | Timed platform | Upstroke launcher | Rider motion and one-time velocity inheritance |
| Moving lift | Safe ride | Gap skip | No jitter, slipping through or double inheritance |
| Crusher | Avoid underside | Ride top | Distinct lethal faces; clear telegraph |
| Dumpster / awning | Landing point | Bounce | Later impulse on contact, cooldown prevents repeated overlap boosts |
| Crane hook / suspended platform | Timing challenge | Shortcut | Later authored arc; collision matches visible support |
| Train / truck | Collision danger | High-speed transport | Later safe top, lethal front; deterministic timetable |
| Steam / electricity | Timed hazard | Route timing signal | Later telegraph, active volume, recovery; no invisible damage |
| Falling beam | Threat | Temporary bridge | Later deterministic trigger/reset and clear lifetime |

Every addition must be tested in combination with at least two established mechanics. The environment should create routes without adding buttons. Do not implement every table row before the slice proves the core.

## 7. Failure, restart and recovery

Death is a short readable pop/bonk, then automatic restart at roughly 350 ms in the lab, under 500 ms target. R bypasses that delay. No loading screen or confirmation. Reset parcel state, all machine phases, tick counter, input buffers and camera. Cosmetic particles must not survive in ways that obscure the new spawn.

Ordinary falls onto lower geometry cost time rather than health. Recovery routes must connect back into the delivery; avoid pits that leave a living player permanently trapped. True lethal volumes and out-of-bounds terminate the attempt. Standard play has no fall damage; fragile parcels can react to impact separately. A machine trapping the courier against a solid is a crush, not indefinite jitter.

M1 has no mid-run checkpoints. The slice may include practice checkpoints, explicitly unranked, if long onboarding challenges need them. Never compare checkpoint runs to clean records.

## 8. Delivery and package systems

Standard parcel is cosmetic once collected. Pickup occurs on overlap and completion requires both possession and overlap with the recipient zone. Later chained missions use an ordered objective list with explicit package and recipient IDs. Prevent duplicate pickup/delivery events across ticks.

Modifiers are introduced only after ordinary movement is understood. Different modifiers are distinct record categories, not an unlabelled change to the same leaderboard.

| Modifier | Proposed rule | Production status |
| --- | --- | --- |
| Fragile | Three hard impacts break it; one damage event per contact, impact threshold tuned from landing telemetry | First slice candidate |
| Hot food | Freshness bonus decays with active run time, delivery remains valid | First slice candidate |
| Heavy | Lower acceleration, stronger downhill response; optional marked breakables | Post-slice prototype |
| Balloons | Reduced gravity and reduced control; no hard-to-predict randomness | Post-slice prototype |
| Oversized | Explicit enlarged clearance collider, previewed before start | Post-slice prototype |
| Live fish | Deterministic slosh affects movement slightly | Experimental; cut if it compromises precision |
| This side up | Would require a defined package orientation system | Unresolved; do not punish cosmetic courier rotation |
| Do not shake / mystery | Comedic authored behavior | Unspecified; no random ranked-run sabotage |

Fragile damage should use relative collision speed before response, not post-collision velocity. Store impact cooldown/contact identity. Broken parcel ends attempt with the same fast retry flow. Show remaining integrity through shape plus color. Do not require stopping or an inventory screen to inspect packages.

## 9. Level design and slice content

Competent first completion target: **20 seconds to 2 minutes**. Fast expert lines can be substantially shorter. Small deliveries may show most of the route at once; larger ones use a velocity-aware camera and persistent destination cue. Introduce a machine safely, test it, then combine it. Never build only single-file obstacle corridors.

Each level design record contains purpose, spawn/parcel/recipient positions, at least one beginner line, one expert possibility, one lower recovery path, dangerous optional tip placement, an accessibility/readability pass and measured rank targets. Route sketches are hypotheses until proven playable.

The initial slice backlog:

| ID | Delivery | Teaching / combination | Alternate-route intent |
| --- | --- | --- | --- |
| 1-01 | First Day | Run, variable jump, automatic pickup | Long run-up clears two steps |
| 1-02 | Lobby Closed | Coyote edge, wall slide and kick | Exterior wall route |
| 1-03 | Alley Express | Slope, crouch passage | Upper jump versus lower slide |
| 1-04 | Return to Sender | Falling recovery and backtracking | Deliberate drop finds fast alley |
| 1-05 | Handle With Care | Fragile parcel, soft landing choice | Faster controlled wall descent |
| 1-06 | Lunch Rush | Street mechanics, hot food bonus | Roofline bypass; optional secret |
| 2-01 | Site Induction | Moving lift | Timed jump inherits motion |
| 2-02 | Belt and Braces | Conveyor and wall jump | Boosted upper entrance |
| 2-03 | Ventilation Required | Fan and airborne steering | Fan-to-wall transfer |
| 2-04 | Going Up | Piston timing and safe upper face | Upstroke skips scaffold switchback |
| 2-05 | Suspended Service | Crane platform after stable mover support | Suspended shortcut and lower recovery |
| 2-06 | Special Instructions | Combined delivery examination | Three route families, hidden Black Label entrance |

Rank thresholds come from recorded clean runs, not guesses. Lab values of 45/30/22 seconds are explicitly provisional. Avoid forcing players to wait for a full machine cycle every restart; phase zero should support immediate movement. Draw destination signposting into the world, not only the HUD. Secrets reward curiosity but are not completion gates.

## 10. Campaign progression

| District | Identity | New emphasis |
| --- | --- | --- |
| 01 Street Level | Alleys, shops, apartments, parking | Fundamental movement and recovery |
| 02 Construction | Scaffolding, cranes, lifts | Moving geometry |
| 03 Transit | Stations, traffic, rail | Timing and moving transport |
| 04 Factory | Fans, pistons, conveyors, presses | Machinery combinations |
| 05 Downtown | Offices, billboards, window washers | Route synthesis |
| 06 High Rise | Glass towers, wind, large gaps | Extreme movement and exposure |
| 07 Skyline | Antennas, broadcast towers, helipads | Mastery and comic final delivery |

The city is a conceptual continuous ascent assembled from discrete deliveries. A district map conveys elevation; it is not one enormous streaming open world. As height increases, traffic gives way to roofs, distant buildings, clouds and finally a tiny city below. Unlock the next standard delivery by completing the previous one; optional mastery routes and cosmetics do not block ordinary campaign progress. District completion can open a choice of deliveries later if testing supports it.

## 11. Rankings, records and ghosts

Delivered = finish; Express = target; Send It = expert; Unhinged = very hard optional developer/reference line. Show milliseconds, personal best, thresholds and instant retry/next. Unhinged may remain hidden until a player approaches it in the full game. Death count is contextual; standard individual-level boards compare clean successful attempts.

Record key includes level ID, content version, physics version, modifier/category and assist settings. Lab station warps never save competitive records. Timing starts on first movement input and ends on delivery collision. Practice pause is permitted locally; any future verified competition must define pause rules and reject incompatible runs. If frames are dropped, tick time remains consistent but should not be presented as an anti-cheat guarantee.

Ghost roadmap: first record local transform samples at a modest rate for visual personal-best ghosts, then deterministic input replays with version and checksum, then sharing. A visual ghost is not proof of valid play. Online boards require an actual backend, validation/rate limits, moderation, identity/privacy decisions and abuse testing. GitHub Pages alone cannot provide secure global records. Do not market localStorage scores as verified global competition.

Daily Delivery should select an authored level plus validated modifier using a published date/seed/version. UTC rollover needs clear UI and a grace rule for started attempts. Weekly Route combines five deliveries; deaths add a fixed published penalty instead of restarting the entire chain. Both are post-slice features with separate record categories.

## 12. Art, animation, camera and audio

Art target: clean illustrated 2D with optional 2.5D depth cues, chunky shapes, strong courier silhouette, slightly exaggerated architecture, bright signage and readable machinery. No pixel-art mandate, generic neon cyberpunk or visual noise masking landing surfaces. Background people, pigeons and construction life are decorative; they do not resemble collidable objects.

Gameplay palette: light edges indicate standable geometry; amber marks motion/energy; coral stripes and shapes indicate lethal regions; mint destination uses text and a boundary. Color is supplemental, not the only cue. Courier remains distinct at zoomed-out play scale. Squash/stretch and lean decorate the fixed collider; changing sprite pose cannot change collision.

Animation set: idle bounce, acceleration/run cycles, skid, rising, falling, wall slide, kick, crouch slide, later hang/mantle, landing, pickup, delivery and quick deaths. Important poses remain readable at 60 Hz. Camera follows position with modest velocity look-ahead, clamps to level bounds and snaps on restart. Reduced-motion settings remove trails and later shake; camera must not overshoot into unreadable hazards. A camera interpolation pass is allowed once the physical model is stable.

Audio: speed-aware footsteps, jump whoosh, landing thump, wall scrape, conveyor hum, fan airflow and phase-synchronized piston clunk. Give hazards a readable cue without requiring hearing. The lab's optional oscillator sounds are temporary feedback. Real sound requires licensed/original assets, master/music/effect sliders and remembered mute. Music is upbeat and supports flow; no forced audio before user interaction. Dispatch exchanges are short, optional and never block an active run.

Asset pipeline: keep editable source art separate from shipped exports; use original SVG/PNG sprite sheets and audio exports with consistent naming and documented dimensions. Record source, author, license and alterations in an asset ledger. Validate alpha edges and sprite pivots at actual gameplay size. Decorative art must pass a collision-overlay review. Do not generate final art before physics and level scale stabilize.

## 13. UX, accessibility and persistence

M1 page opens directly into the lab with visible controls, status and retry. The slice adds title/district map, delivery card, settings and results without long transitions. No modal tutorials that interrupt jumps. Keyboard focus must remain visible; page buttons work with Enter/Space. Pause on tab loss; clear stale keys. Offer reduced motion, independent volume, remapping, readable UI scale and non-color hazard cues. Evaluate optional slower practice simulation separately from ranked categories.

Canvas gameplay is visually driven; DOM labels and controls improve surrounding navigation but do not make platforming fully screen-reader accessible. Document that limitation rather than claiming full accessibility. Add controller and wider screen-size testing before the slice release.

Current save is only a versioned local personal-best value. Slice schema: `{schemaVersion, settings, completedDeliveries, bestRuns, tips, unlockedCosmetics}`. Validate types/ranges, migrate known older versions, and fall back gracefully on malformed or denied storage. No progress should be destroyed silently during migration. Add explicit JSON export/import and reset confirmation when persistent progression exists. Local data is device/browser specific until a separate sync feature is built. Never store secrets or account credentials in game saves.

## 14. Architecture and data contract

The initial repository is dependency-free ES modules and Canvas 2D. This keeps offline development and static hosting simple and lets physics run headlessly in Node tests. Reconsider a library only if profiling or authoring needs justify the cost; do not rewrite the movement controller solely to adopt a framework.

| Path | Responsibility |
| --- | --- |
| `index.html`, `style.css` | Accessible DOM shell, HUD, results, settings |
| `src/main.js` | Input, frame accumulator, pause/retry, save adapter, event audio |
| `src/physics.js` | Pure simulation, tuning, machine transforms, collisions |
| `src/level.js` | Versioned laboratory data |
| `src/render.js` | Camera and visual presentation, no gameplay authority |
| `tests/*.test.mjs` | Node simulation regression tests |
| `scripts/serve.mjs` | Loopback-only static development server |
| `docs/` | GDD, milestone state and playtest protocol |

Level format v1 contains `id`, `version`, `width`, `height`, `spawn`, `parcel`, `delivery`, `targets`, `solids`, `slopes`, `conveyors`, `fans`, `movers`, `hazards`, `labels` and lab-only `stations`. All collision objects have stable IDs; rectangles specify x/y/w/h. Slopes specify x/w/y1/y2. Movers specify origin, axis, displacement and period. Machine data is immutable during a run; runtime transforms live in world state. Simulation produces event identifiers; renderer/audio consume them without writing physics.

Before multiple levels ship, add a loader validator: unique IDs, positive dimensions and periods, finite coordinates, valid references, spawn/recipient clearance, ordered rank thresholds and category versioning. Split delivery flow and save adapter out of `main.js` as the slice requires them. A visual level editor is deferred; authored data plus debug overlays are adequate initially. Future schema changes require explicit version migration rather than guessing field meanings.

## 15. Performance, testing and quality gates

Target smooth 60 FPS on an ordinary desktop at 1280×720 internal resolution, with 120 Hz simulation. Initial budgets: under 4 ms simulation and 8 ms rendering at representative slice load; measure before claiming these pass. Cap catch-up to prevent a spiral of death. Avoid allocations in hot loops only when profiles justify it. Keep load lightweight; M1 has no remote assets or external fonts. Asset compression and atlas work follow real content.

Automated checks must cover acceleration and boost retention, short/full jumps, coyote/buffer windows, wall contact/kick, crouch clearance, slopes, fast hazards/thin surfaces, support carry and launch, crush detection, objective order, timer and reset determinism. Tests should measure outcomes, not copy formulas from implementation. Runtime/browser checks cover first load, keyboard input, retry, pause on blur, result overlay, persistence and console errors.

Manual movement protocol: spend 3 minutes on empty-floor run/jump, 3 on walls, 3 on slide/slope, 5 on machinery combinations and 6 on free routing. Ask whether the player wants another attempt; log sticky corners, unintended ledge grabs, blind landings, confusing hazard surfaces and momentum loss. Record changes alongside representative route times. M1 cannot be declared fun solely because automated tests pass.

Release checks: no console errors, no missing assets, cold-load and nested-path hosting work, records survive refresh, denied storage does not break play, restart remains under 500 ms, no reachable softlock, and keyboard focus/pause behave correctly. Verify Chrome/Edge first and Firefox next. Validate public deployment independently of local server success.

## 16. Milestones and build order

### M1 — Movement laboratory (current, in progress)

1. Establish repository, this specification and simple browser entry point.
2. Build independent fixed-step physics and tunable controller.
3. Add slopes, slide clearance, wall behavior, carry and launch mechanics.
4. Build the seven-station graybox room and minimal delivery/timing loop.
5. Add outcome-based regression tests, telemetry, record versioning and fast retry.
6. Browser smoke-test and perform the 20-minute feel session.
7. Resolve ledge-grab scope, collision edge cases and tuning from actual feedback.

Gate: stable collision and reset, reliable machine combinations, all intended lab zones reachable, standard parcel delivery possible, no forced waiting, and the subjective 20-minute test passes. The first implementation is an iteration toward that gate, not the completed milestone.

### M2 — Street Level + Construction slice (playable content complete)

Lock a movement baseline; create level loader/validation; build the 12 deliveries in graybox; verify routes; add standard/fragile/hot-food objectives; tune real rank targets; add original courier/city art and sound; implement district progression, tips, first cosmetics and optional secret. Evaluate personal-best ghost after core content is stable. Gate: new player understands controls and finishes first district, expert finds multiple routes, save migration and all browser checks pass.

Build 11 completes the twelve-delivery route count with two sequential six-job shifts and verified ordinary-input paths. Objective modifiers, tips, cosmetics, authored sound, wider player medal data, and formal cross-browser certification remain within M2 before its full quality gate closes.

Build 12 reconstructs those jobs around mandatory route actions rather than a flat recovery floor. The learning order now moves from jump and slide gates into conveyor gaps, fans, wall climbing, a full out-and-back collection, chained belts, moving lifts and mixed-mechanic upper routes. Parcel locations are part of route planning, with collection points spread through each course and several placed above street level.

Build 13 introduces the first package-objective layer. Every job declares a visible Standard, Hot, Fragile, Oversized, or Signature contract. Hot freshness counts down only after collection; fragile condition responds to landing impact and reaches a clear failure at zero. Contract status is shown on the board, HUD, feedback banner, and result screen.

### M3 — Release-quality foundation

Controller/remapping, accessibility settings, export/import, replay versions, profiling, art/audio consistency and public static build. Establish issue triage from external playtests. Gate: broad browser validation, clear versioning, no known blocker or progress-loss defect, and repeatable deploy/rollback.

### M4 — City expansion

Transit and Factory first, then Downtown, High Rise and Skyline. Add one machine family at a time and validate its combinations. Scale delivery count only with proven authoring throughput and variety. Gate each district independently; do not fill a 100-level quota with repeated jumps.

### M5 — Competitive/replay services (optional)

Daily/weekly challenges, shared ghosts and verified online rankings after explicit backend, hosting, privacy and operating-cost decisions. A polished local/browser game can ship without these systems.

## 17. Git, GitHub and deployment workflow

Use a dedicated Git repository at `C:\GPT_DEV\send-it`, main branch, with source, design docs and tests tracked together. Keep unrelated projects outside this repo. Commit small reviewed changes; record physics/content versions in release notes. Do not check in generated caches, recordings, credentials or huge source assets without an asset-storage decision. Initial local commit establishes the baseline.

The user's standing rule requires a public GitHub repository and shareable deployed play URL. SEND IT uses Dumb-Tony/send-it and GitHub Pages at https://dumb-tony.github.io/send-it/. Static paths are relative for project-subpath hosting. No bundler is necessary: the Pages workflow runs regression tests and publishes only index.html, style.css and src/. Test the actual public URL and console after deployment. Roll back to a known release commit if a build regresses. Never claim a deployment exists based on a workflow file alone. Public play URLs are the default handoff; localhost links are development-only.

## 18. Risks, open decisions and cut order

Highest risks: movement feels generic; assist actions steal intentional jumps; slope seams or moving geometry produce rare deaths; art hides physics; campaign grows faster than tested mechanics; online scope distracts from local fun. Mitigation is early feel testing, pure simulation tests, visible collision telemetry and milestone gates.

Open questions to resolve through play: stronger N-like inertia versus sharper reversal; full ledge hanging versus limited auto-step; slope-tangent launch; piston dwell/ease timing; preferred camera scale; when to introduce modifiers; whether the first two districts need 10, 12 or 15 deliveries. The current build makes reversible baseline choices so these questions do not block starting.

Cut order if scope expands: online services → daily/weekly → extra package modifiers → extra cosmetics → background life → extra districts. Never cut collision reliability, fast retry, readable machinery or route freedom to preserve peripheral features.

Success means players enjoy moving, understand why an attempt failed, and immediately want to try a better line. Content volume is secondary.
