# Contributing to Screen

Thanks for taking the time to contribute. Screen is a source-distributed component
library: consumers copy files into their own projects, so a change here is a change
in every downstream codebase. Small, focused pull requests are easiest to review.

## Before you start

- Open an issue for anything larger than a typo or a one-line fix, so we can agree
  on the approach before you write code.
- Security problems must **not** go through public issues. See [SECURITY.md](./SECURITY.md).

## Requirements

- Node.js 20 or newer
- pnpm 10 (`corepack enable` is the quickest way to get it)

## Setup

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm demo          # http://localhost:4318
```

## What a component change looks like

1. Edit the component under `lib/<category>/`.
2. If the public API changed, update the matching item in `registry.json`
   (title, description, dependencies, files).
3. Add or update a test under `tests/`.
4. Rebuild the registry artifacts:

   ```bash
   pnpm registry:build
   ```

   This rewrites `public/r/*.json` and `public/r/agent-catalog.json`. Commit the
   generated files together with the source change — consumers install from them.
5. Run the full gate:

   ```bash
   pnpm verify
   ```

## Component guidelines

- One component per file, named exports, no default exports.
- No network calls. The only exception is `lib/docs/`, where the endpoint comes
  from a prop supplied by the host application.
- No `dangerouslySetInnerHTML` unless the content is a module-level constant.
  Never interpolate props or user data into injected HTML.
- Every `target="_blank"` link sets `rel="noopener noreferrer"`.
- Do not persist anything beyond theme preferences, and keep storage access
  wrapped in `try/catch`.
- Components are presentation only. Never imply that a UI control authorizes an
  action — authorization belongs on the server.
- Keep the import surface small: prefer existing dependencies over adding new ones.

## Commit messages

Conventional Commits style, e.g. `feat(chatbot): add streaming caret`,
`fix(docs): encode locale in search URLs`, `docs: clarify theme import order`.

## Pull requests

- Describe the user-visible change and link the issue it closes.
- Note any breaking change to a component's props in the PR description.
- CI must pass: typecheck, tests, production audit, registry build, demo build.

## License

By contributing you agree that your contribution is licensed under the MIT
License in [LICENSE](./LICENSE).
