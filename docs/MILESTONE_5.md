# Build 13 — Special Handling

14 September 2026. This build adds delivery-specific stakes to the reconstructed Rookie Route.

## Contracts

- **Hot:** freshness begins at 100% when the parcel is collected and falls during the delivery leg. At zero, the run ends with a direct-route hint.
- **Fragile:** landing impact is measured after collection. Hard impacts reduce parcel condition, trigger an immediate warning, and break the parcel at zero.
- **Standard:** route and time are the only requirements.
- **Oversized:** the dispatch card identifies an awkward upper route while the courier's collider and accepted movement stay unchanged.
- **Signature:** the route brief identifies a required recipient or return path.

Contract type is visible on all twelve dispatch cards. The dashboard changes from the package description to live freshness, condition, or secured status after collection. Results report final handling quality alongside time, medal thresholds, and retries.

## Verification

All campaign jobs declare complete contract metadata. The real-time browser session checks that a Hot result reports freshness, then verifies next-job flow, unlocks, and persistence after reload. Full route and movement regressions remain required before deployment.
