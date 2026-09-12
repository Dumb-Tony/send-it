# SEND IT project rules

Follow C:\GPT_DEV\AGENTS.md. Keep the accepted movement feel; do not change physics tuning casually.

- Public GitHub repository: Dumb-Tony/send-it.
- Public play URL: https://dumb-tony.github.io/send-it/.
- Push reviewed changes to main. The Pages workflow tests the simulation and deploys the static game. Wait for success and verify the public game before handing it back.
- Keep diagnostics and temporary local servers out of Git. Deploy only index.html, style.css, src/, and .nojekyll.
- Run `node --test tests/*.test.mjs`. For gameplay changes, inspect both full route replays and changed mechanics in the browser as described in docs/PLAYTEST.md.
- Give the public play URL as the primary user-facing link. Local servers are development tools only.
