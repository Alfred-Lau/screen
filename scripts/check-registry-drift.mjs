#!/usr/bin/env node
/**
 * Compares the registry built in this repository with the one the site serves.
 *
 * The site (screen.solokit.run) is deployed from a separate, private repository,
 * so the two can drift whenever a component is edited on one side only. The
 * published registry JSON embeds the full source of every file, which makes the
 * hosted artifacts a faithful stand-in for that other repository — no private
 * checkout or PAT needed.
 *
 * Baseline is `public/r/*.json` (the built artifacts, which carry file contents),
 * not `registry.json` (the source index, which does not).
 *
 * Exit codes: 0 = in sync, 1 = drift found, 2 = the check itself failed.
 *
 * Env:
 *   REGISTRY_ORIGIN  default https://screen.solokit.run
 *   GITHUB_TOKEN     when set, opens/comments/closes the tracking issue
 *   GITHUB_REPOSITORY owner/repo, required when GITHUB_TOKEN is set
 */

import fs from "node:fs"

const ORIGIN = (process.env.REGISTRY_ORIGIN || "https://screen.solokit.run").replace(/\/$/, "")
const LABEL = "registry-drift"
const CONCURRENCY = 8
// Generated index, not a component: its timestamp changes on every build.

// Driven by registry.json, not by whatever happens to sit in public/r: stale
// artifacts of removed components must not be reported as drift.
const registry = JSON.parse(fs.readFileSync("registry.json", "utf8"))
const names = (registry.items || []).map((item) => `${item.name}.json`).sort()

/** Fields that define behaviour. Copy changes are ignored on purpose: the site
 *  rewrites some descriptions for display, and a stale sentence is not drift. */
function shape(item) {
  return {
    type: item.type,
    dependencies: [...(item.dependencies || [])].sort(),
    registryDependencies: [...(item.registryDependencies || [])].sort(),
    files: (item.files || [])
      .map((f) => ({ path: f.path, type: f.type, target: f.target, content: f.content }))
      .sort((a, b) => a.path.localeCompare(b.path)),
  }
}

async function fetchItem(file) {
  const res = await fetch(`${ORIGIN}/r/${file}`, { redirect: "follow" })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`)
  return res.json()
}

async function mapLimit(list, limit, fn) {
  const out = new Array(list.length)
  let i = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, list.length) }, async () => {
      while (i < list.length) {
        const index = i++
        out[index] = await fn(list[index], index)
      }
    }),
  )
  return out
}

function firstDifference(localItem, remoteItem) {
  const local = shape(localItem)
  const remote = shape(remoteItem)
  if (local.type !== remote.type) return `type: ${local.type} → ${remote.type}`
  for (const key of ["dependencies", "registryDependencies"]) {
    const l = local[key].join(", ")
    const r = remote[key].join(", ")
    if (l !== r) return `${key}: [${l}] → [${r}]`
  }
  const paths = new Set([...local.files.map((f) => f.path), ...remote.files.map((f) => f.path)])
  for (const path of paths) {
    const l = local.files.find((f) => f.path === path)
    const r = remote.files.find((f) => f.path === path)
    if (!l) return `file only on the site: ${path}`
    if (!r) return `file only in this repo: ${path}`
    if (l.content !== r.content) return `content differs: ${path}`
  }
  return null
}

async function main() {
  const results = await mapLimit(names, CONCURRENCY, async (file) => {
    const local = JSON.parse(fs.readFileSync(`public/r/${file}`, "utf8"))
    const remote = await fetchItem(file)
    if (!remote) return { name: local.name || file, file, detail: "not published on the site" }
    const detail = firstDifference(local, remote)
    return detail ? { name: local.name || file, file, detail } : null
  })

  const drift = results.filter(Boolean)
  const checked = names.length
  const summary = `${checked - drift.length}/${checked} entries match`

  if (!drift.length) {
    console.log(`in sync — ${summary}`)
    await settleIssue(null, summary)
    return 0
  }

  const body = [
    `The registry served by ${ORIGIN} no longer matches the one built in this repository.`,
    "",
    `Checked ${checked} entries, **${drift.length} drifted**.`,
    "",
    "| Item | Problem |",
    "| --- | --- |",
    ...drift.map((d) => `| \`${d.name}\` | ${d.detail.replace(/\|/g, "\\|")} |`),
    "",
    "The site is built from the private `solokit-element` repository. A component was",
    "edited on one side only — port the change across, rebuild the registry on both",
    "sides (`pnpm registry:build`), and this check goes quiet again.",
    "",
    `_Checked at ${new Date().toISOString()}._`,
  ].join("\n")

  console.log(`drift — ${summary}`)
  for (const d of drift) console.log(`  ${d.name}: ${d.detail}`)
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, body + "\n")
  await settleIssue(body, summary)
  return 1
}

/** One tracking issue, updated in place, closed once the sides agree again. */
async function settleIssue(body, summary) {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPOSITORY
  if (!token || !repo) return

  const api = `https://api.github.com/repos/${repo}`
  const headers = {
    authorization: `Bearer ${token}`,
    accept: "application/vnd.github+json",
    "content-type": "application/json",
    "user-agent": "registry-drift-check",
  }
  const call = async (path, init = {}) => {
    const res = await fetch(`${api}${path}`, { headers, ...init })
    if (!res.ok) throw new Error(`${init.method || "GET"} ${path} → ${res.status} ${await res.text()}`)
    return res.status === 204 ? null : res.json()
  }

  // Idempotent: 422 means the label already exists.
  await fetch(`${api}/labels`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: LABEL, color: "d93f0b", description: "The site and this repo disagree" }),
  }).catch(() => {})

  const open = await call(`/issues?state=open&labels=${LABEL}&per_page=1`)
  const existing = open[0]

  if (!body) {
    if (existing) {
      await call(`/issues/${existing.number}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: `Back in sync — ${summary}. Closing.` }),
      })
      await call(`/issues/${existing.number}`, { method: "PATCH", body: JSON.stringify({ state: "closed" }) })
    }
    return
  }

  if (existing) {
    await call(`/issues/${existing.number}/comments`, { method: "POST", body: JSON.stringify({ body }) })
    return
  }

  await call(`/issues`, {
    method: "POST",
    body: JSON.stringify({ title: "Registry drift: the site and this repo disagree", body, labels: [LABEL] }),
  })
}

main().then(
  (code) => process.exit(code),
  (error) => {
    console.error(error)
    process.exit(2)
  },
)
