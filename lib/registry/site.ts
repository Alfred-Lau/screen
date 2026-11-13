export const REGISTRY_ORIGIN =
  process.env.NEXT_PUBLIC_REGISTRY_ORIGIN || "https://screen.solokit.run";

export const MCP_URL = `${REGISTRY_ORIGIN}/api/mcp`;

export const LLMS_PATH = "/llms.txt";

export function installCommand(name: string): string {
  return `npx shadcn@latest add "${REGISTRY_ORIGIN}/r/${name}.json"`;
}

export const MCP_ADD_COMMAND = `claude mcp add --transport http solokit ${MCP_URL}`;

export const CODEX_MCP_ADD_COMMAND = `codex mcp add solokit --url ${MCP_URL}`;
