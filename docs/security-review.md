# Security & privacy review

**Subject:** `screen` (Screen component library)
**Scope:** all source under `lib/`, `components/ui/`, `registry.json`, `public/r/`, build scripts
**Date:** 2026-11-05
**Reviewer:** internal, pre-publication

This review was run before the repository was made public. It covers code-level
weaknesses, data exposure, supply chain and the security posture a consumer
inherits by installing these components.

---

## 1. Summary

| Area | Result |
|---|---|
| Hardcoded secrets | None found |
| Dangerous dynamic execution (`eval`, `new Function`, `document.write`) | None found |
| Unescaped HTML sinks | 3, all static — no user input reaches them |
| Cross-window messaging | None |
| External links | 6, all `rel="noopener noreferrer"` |
| Client-side storage | Theme preference only, no PII |
| Production dependency vulnerabilities | 0 |
| Local paths / internal hostnames in artifacts | None |
| Install scripts in dependency tree | 1 (`msw`, dev-only) |

Four issues were found and fixed before publication (section 3).

---

## 2. What was checked and passed

### 2.1 Secrets and credentials

Searched for API keys, bearer tokens, cloud credentials and private endpoints
across TypeScript sources, JSON and build scripts. The repository ships no
`.env` file with values and no key material. `.env` contains a single comment.

### 2.2 Dynamic execution

No `eval`, `new Function`, `document.write`, `setTimeout(string)` or dynamic
`import()` of user-controlled paths.

### 2.3 HTML injection

Three `dangerouslySetInnerHTML` sinks exist:

| File | Content | Source |
|---|---|---|
| `lib/chatbot/loader.tsx` | `@keyframes` block | literal string |
| `lib/chatbot/loader.tsx` | `@keyframes` block | literal string |
| `lib/chatbot/reasoning.tsx` | scrollbar-hiding CSS | module-level constant |

None accept props, children or network data. They are compile-time constants,
so there is no injection path. Consumers must not repurpose them for dynamic
content — noted in `SECURITY.md`.

### 2.4 External navigation

Six anchors render `target="_blank"`. All six set
`rel="noopener noreferrer"`, so a destination page cannot reach back through
`window.opener` or read the referrer. This is asserted by a test
(`tests/chatbot-sources.test.tsx`) so a future refactor cannot silently drop it.

### 2.5 Client-side storage

The only write is the theme preference (`solokit-theme-mode`). Values are
validated against an allowlist (`light` / `dark` / `system`) before use, and an
unrecognised stored value falls back to `system` rather than being applied.
No identifiers, tokens, conversation content or user data are persisted.

### 2.6 Network surface

Components perform no background requests. The only fetch lives in the docs
module and is driven entirely by an `endpoint` prop supplied by the host
application.

### 2.7 Build artifacts

`registry.json` and `public/r/*.json` were scanned for absolute paths,
`localhost`, private IP ranges and `.local` hostnames. All artifacts reference
the public origin or relative paths only.

### 2.8 Dependencies

- 22 direct dependencies, all MIT / Apache-2.0 / ISC.
- `pnpm audit --prod` reports **0 vulnerabilities**.
- Three advisories exist in the dev chain (`zod`, `deepmerge`, `minimatch`),
  reached through the `shadcn` CLI and tooling. None are bundled or shipped to
  consumers.
- One dependency runs an install script: `msw` (dev-only, used by `shadcn`).
  Reviewed — it generates a browser worker file, no network egress.

---

## 3. Issues found and fixed

### 3.1 Legacy brand key in localStorage — fixed

`lib/theme-provider.tsx` read and wrote the key `seo-sentinel-theme`, left over
from another product. Two consequences: it leaked an unrelated brand into a
public library, and two Screen-based apps on the same origin would have shared
theme state with that other product.

Now a single exported constant `THEME_STORAGE_KEY = "solokit-theme-mode"`, used
by both the read and the write path, and re-exported so hosts can inspect or
clear it.

### 3.2 Console logging of the document root — fixed

Two `console.log` calls printed `document.documentElement.className` on every
theme change. In production this floods the console and exposes the host page's
class list to anything reading logs. Removed.

### 3.3 Unencoded locale in fetch URLs — fixed

The docs module built `?locale=${locale}` without encoding. A locale value
containing `&` or `#` would have altered the query string. Now wrapped in
`encodeURIComponent` across all three call sites.

### 3.4 Unused `next/image` import in the chat layer — fixed

`lib/chatbot/message.tsx` imported `next/image` without using it. Harmless at
runtime, but it dragged a Next.js dependency into the chat primitives and would
have broken non-Next consumers. Removed.

---

## 4. Boundaries consumers must understand

These are not defects, but they are the places where a consumer can create a
vulnerability by misusing the library.

### 4.1 Permission UI is not authorization

`ToolPermission` and `ApprovalCard` render a decision surface. They do **not**
enforce anything. `onAllow` / `onDeny` are callbacks into your code. If you
execute the tool in the browser after `onAllow` fires, a user can call the same
function directly from the console.

Both components now carry a header comment stating this. The rule: the browser
collects intent, the server decides.

### 4.2 Docs endpoints are host-supplied

`DocLayout` and `DocSearch` accept an `endpoint` prop and fetch it. If you pass
a value derived from user input, you have built an SSRF primitive. Pass a
constant from your own config.

### 4.3 No content sanitization

The library renders what you give it. `MessageContent` accepts arbitrary React
nodes; `CodeBlock` renders a string as text (safe); nothing sanitizes HTML. If
you pipe model output or third-party content into a component, sanitize it
first.

### 4.4 Theme writes to `documentElement`

`ThemeProvider` toggles the `dark` class on `<html>`. Expected behaviour, but
worth knowing if you run multiple design systems on one page.

---

## 5. Recommendations for publication

1. Enable GitHub private vulnerability reporting and point `SECURITY.md` at it
   (done).
2. Enable Dependabot alerts and automated security updates on the public repo.
3. Run `pnpm audit --prod` in CI on every push.
4. Keep the `noopener noreferrer` assertion in the test suite — it is the one
   security invariant most likely to regress silently.
5. Do not add analytics or telemetry to the library itself. If the docs site
   needs it, keep it out of the published package.

---

## 6. Verification

Reproduce the automated part of this review:

```bash
pnpm install
pnpm typecheck      # 0 errors
pnpm test           # 72 tests, incl. the link-safety invariant
pnpm registry:build # 105 items
pnpm audit --prod   # 0 vulnerabilities
```

---

## 7. Re-review before open sourcing — 2026-11-13

The review above was written on 2026-11-05. Between then and publication the
registry changed (the provider-icon component was removed, 105 items now), so the
repository was re-checked end to end.

| Check | Result |
|---|---|
| Secrets in tracked files | None. `.env.local` holds a Vercel OIDC token, is untracked and covered by `.env*` in `.gitignore` |
| Secrets anywhere in git history | None — no `.env`, `.pem` or `.key` ever committed |
| Internal hostnames / private endpoints in source or artifacts | None. Only the public origin `screen.solokit.run` and `ui.shadcn.com` appear |
| Internal product or customer names | None found in `lib/`, `components/`, `demo/src/`, docs |
| `dangerouslySetInnerHTML` | 3, all module-level constants (`lib/chatbot/loader.tsx` ×2, `lib/chatbot/reasoning.tsx`). No props or network data reach them |
| Dynamic execution (`eval`, `new Function`, `document.write`) | None |
| External links | All `target="_blank"` anchors set `rel="noopener noreferrer"`; asserted by `tests/chatbot-sources.test.tsx` |
| Client-side storage | Theme preferences only (`solokit-theme-mode`, `solokit-active-theme-id`, `solokit-custom-themes`), every access wrapped in `try/catch` |
| Runtime dependencies | `pnpm audit --prod` → 0 vulnerabilities; all licences MIT / Apache-2.0 / ISC / 0BSD |
| Third-party code | No vendored source. The chat primitives follow the AI Elements API shape but are independent implementations (see Acknowledgements) |
| Verification | `pnpm typecheck` 0 errors, `pnpm test` 72/72, `pnpm demo:build` succeeds, `pnpm registry:build` produces 105 items |

Publication changes made in this pass: `package.json` now points at
`Alfred-Lau/screen` and is marked `private` (the library is distributed as
registry source, not as an npm package); community files (CONTRIBUTING,
CODE_OF_CONDUCT, CHANGELOG, issue/PR templates, Dependabot) were added; the README
documents self-hosting the registry and where the MCP handler lives.
