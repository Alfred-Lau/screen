# Security Policy

## Supported versions

The `main` branch is the supported version. Components are distributed as source, so the copy in your project is yours to patch.

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

- Use GitHub's [private vulnerability reporting](https://github.com/Alfred-Lau/screen/security/advisories/new), or
- Email the maintainer listed on the GitHub profile.

Include the affected file, a minimal reproduction, and the impact you believe it has. We aim to acknowledge within 3 business days.

## Security model

Screen ships UI components, not a security boundary. A few things are worth stating explicitly:

### Permission and approval components are presentation only

`lib/agent/tool-permission.tsx` and `lib/agent/approval.tsx` render a decision surface and forward the user's choice through callbacks. They do **not** enforce authorization. A click in the browser is a UI event. Re-check every tool call, scope and risk level on the server before executing it.

### No network calls from components

Components in `lib/chatbot`, `lib/agent`, `lib/dashboard`, `lib/form`, `lib/marketing` and `lib/animation` make no network requests. The only `fetch` calls live in `lib/docs/` and target the endpoint you pass in through props — if you feed that prop from user input, validate it against an allowlist to avoid SSRF.

### XSS surface

Three components inject CSS through `dangerouslySetInnerHTML`: `lib/chatbot/loader.tsx` (twice) and `lib/chatbot/reasoning.tsx`. All three inject **static, module-level strings** with no interpolation. Do not refactor them to accept dynamic CSS. If you need dynamic styles, use the `style` prop or CSS variables instead.

Text content is always rendered as React children. `lib/chatbot/code-block.tsx` renders code line by line and never uses `innerHTML`.

### External links

Every `target="_blank"` link in the library sets `rel="noopener noreferrer"`, and `window.open` calls pass `noopener,noreferrer`. Keep that invariant when you edit link components.

### Local storage

Only theme preferences are stored (`solokit-theme-mode`, `solokit-active-theme-id`, `solokit-custom-themes`). Nothing sensitive is persisted, and every read/write is wrapped in try/catch so a blocked storage API degrades to defaults.

### Dependencies

`pnpm audit --prod` reports no known vulnerabilities in the runtime dependency set. Audit results for dev tooling (build, lint, registry generation) are tracked separately and do not ship to consumers.

## Scope

In scope: code in this repository.

Out of scope: the hosted site at `screen.solokit.run`, your own integration code, and vulnerabilities that require a compromised build environment.
