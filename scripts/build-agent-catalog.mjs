import ts from 'typescript';
// Builds public/r/agent-catalog.json: a machine-readable index of the agent
// components so an agent can pick a component and call it without reading docs.
//
// Runs as part of `pnpm registry:build`, after `shadcn build`.

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registry = JSON.parse(fs.readFileSync(path.join(root, "registry.json"), "utf8"));
const origin = process.env.REGISTRY_ORIGIN || "https://screen.solokit.run";

function readSource(filePath) {
  try {
    return fs.readFileSync(path.join(root, filePath), "utf8");
  } catch {
    return "";
  }
}

/** Pulls the first `interface XProps { ... }` block and its fields. */
function parseProps(source) {
  const ast=ts.createSourceFile('component.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const props=ast.statements.find(node=>ts.isInterfaceDeclaration(node)&&node.name.text.endsWith('Props'));
  if(!props)return [];
  return props.members.filter(ts.isPropertySignature).map(member=>({name:member.name.getText(ast),type:member.type?.getText(ast)||'unknown',required:!member.questionToken,description:ts.getJSDocCommentsAndTags(member).map(n=>n.comment||'').join(' ')}));
}

function parseComponentName(source) {
  const match = source.match(/export\s+function\s+([A-Z][\w]*)\s*\(/);
  return match ? match[1] : null;
}

const agentItems = registry.items;

const components = agentItems
  .map((item) => {
    const file = item.files?.find(f => /\.tsx?$/.test(f.path))?.path ?? item.files?.[0]?.path ?? "";
    const source = readSource(file);
    return {
      name: item.name,
      title: item.title ?? item.name,
      description: item.description ?? "",
      component: parseComponentName(source) ?? item.name,
      source: file,
      dependencies: item.dependencies ?? [],
      registryDependencies: item.registryDependencies ?? [],
      files: item.files ?? [],
      categories: item.categories ?? [],
      install: `npx shadcn@latest add ${origin}/r/${item.name}.json`,
      registryUrl: `${origin}/r/${item.name}.json`,
      docs: `${origin}/en/components#${item.name}`,
      props: parseProps(source),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const payload = {
  $comment:
    "Agent-facing catalog for the Screen component library. Pick a component by description, then read props to call it. Each registryUrl resolves to the full source.",
  site: origin,
  generatedAt: new Date().toISOString().slice(0, 10),
  count: components.length,
  components,
};

const outDir = path.join(root, "public", "r");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "agent-catalog.json"), `${JSON.stringify(payload, null, 2)}\n`);


// Items that used to ship with an `agent-` prefix. The registry now uses bare
// names, but old install commands are still in blog posts and bookmarks, so
// keep a copy of each item at the previous URL instead of returning a 404.
const LEGACY_ALIASES = {
  "agent-plan": "plan",
  "agent-trace": "trace",
  "agent-inbox": "inbox",
  "agent-steering": "steering",
  "agent-tree": "tree",
  "agent-memory": "memory",
  "agent-ledger": "ledger",
  "agent-autonomy": "autonomy",
};

let aliasCount = 0;
for (const [legacy, current] of Object.entries(LEGACY_ALIASES)) {
  const source = path.join(outDir, `${current}.json`);
  if (!fs.existsSync(source)) continue;
  const item = JSON.parse(fs.readFileSync(source, "utf8"));
  item.name = legacy;
  fs.writeFileSync(path.join(outDir, `${legacy}.json`), `${JSON.stringify(item, null, 2)}\n`);
  aliasCount += 1;
}
console.log(`legacy aliases: ${aliasCount}`);

console.log(`agent-catalog: ${components.length} components, ${components.filter((c) => c.props.length > 0).length} with parsed props`);
