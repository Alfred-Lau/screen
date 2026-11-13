# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Components are distributed as source through a shadcn registry, so a "release"
is a snapshot of `registry.json` and `public/r/`. Consumers who copy files are
not forced to upgrade; the version tells you what changed.

## [Unreleased]

## [0.1.0] - 2026-11-13

First public release.

### Added

- 105 registry items across seven categories: agent, marketing, animation,
  chatbot, docs, dashboard and form.
- `theme` registry item shipping `styles/screen.css` with design tokens and the
  Tailwind 4 dark-variant redefinition every component depends on.
- `ThemeProvider` with light / dark / system modes, persisted under
  `solokit-theme-mode`, plus a pre-paint snippet that avoids a light flash.
- MCP server (`lib/registry/mcp.ts`) exposing `list_components`,
  `search_components`, `get_component` and `get_source` over HTTP.
- `llms.txt` and `agent-catalog.json` for agent-driven discovery.
- Vite demo covering chat primitives, agent approval surfaces and dashboard cards.
- 72 tests, including the link-safety invariant for external links.

### Security

- Permission and approval components are documented as presentation only.
- No component makes a network request except the docs module, whose endpoint is
  host-supplied.
- Three `dangerouslySetInnerHTML` uses inject static module-level CSS only.
- `pnpm audit --prod` reports no known vulnerabilities.

[Unreleased]: https://github.com/Alfred-Lau/screen/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Alfred-Lau/screen/releases/tag/v0.1.0
