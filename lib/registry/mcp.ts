import { findCatalogItem, listCatalog, readItemSource, renderLlmsTxt, searchCatalog } from "@/lib/registry/catalog";

const PROTOCOL_VERSIONS = ["2025-03-26", "2024-11-05"] as const;
const SERVER_NAME = "solokit";
const SERVER_VERSION = "0.1.0";

const TOOLS = [
  {
    name: "list_components",
    description: "List every item in the free Screen registry, with its name, title and description.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "search_components",
    description:
      "Search the free Screen registry of React components for AI products. Returns names, descriptions and shadcn install commands.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Words to match, such as chat, pricing, auth or marquee. Omit to list the first results.",
        },
        limit: {
          type: "number",
          description: "Maximum results, from 1 to 20. Defaults to 8.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_component",
    description:
      "Read one Screen component by registry name, including dependencies, the install command and the source files.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Registry name, such as conversation or pricing-card.",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "get_source",
    description: "Read the source files for one Screen component by registry name.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Registry name, such as conversation or plan.",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
] as const;

type ToolName = (typeof TOOLS)[number]["name"];

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: unknown;
}

function rpcResult(id: string | number | null, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

function rpcError(id: string | number | null, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isToolName(name: string): name is ToolName {
  return TOOLS.some((tool) => tool.name === name);
}

function toolText(text: string, isError = false) {
  return {
    content: [{ type: "text", text }],
    ...(isError ? { isError: true } : {}),
  };
}

function searchTool(args: Record<string, unknown>) {
  const query = typeof args.query === "string" ? args.query : "";
  const limit = typeof args.limit === "number" && Number.isFinite(args.limit) ? args.limit : 8;
  const total = listCatalog().length;
  const matches = searchCatalog(query, limit);
  if (matches.length === 0) {
    return toolText(`No Screen components match "${query}". The registry has ${total} items.`);
  }
  const lines = matches.map(
    (item) => `- ${item.name} — ${item.title}: ${item.description}\n  ${item.install}`,
  );
  const heading = query.trim()
    ? `Found ${matches.length} match${matches.length === 1 ? "" : "es"} in ${total} components.`
    : `Showing ${matches.length} of ${total} components. Pass a query to narrow this.`;
  return toolText(`${heading}\n\n${lines.join("\n")}`);
}

function listTool() {
  const items = listCatalog();
  const lines = items.map((item) => `- ${item.name} — ${item.title}: ${item.description}`);
  return toolText(`${items.length} components.\n\n${lines.join("\n")}`);
}

function sourceTool(args: Record<string, unknown>) {
  const name = typeof args.name === "string" ? args.name : "";
  if (!name.trim()) return toolText("Pass a component name, such as conversation.", true);
  const item = findCatalogItem(name);
  if (!item) return toolText(`No component named "${name}". Use search_components first.`, true);
  const sources = readItemSource(item);
  const sourceBlocks = sources
    .map((file) => `// ${file.target}\n${file.content}`)
    .join("\n\n");
  return toolText(sourceBlocks || `No source files for ${item.name}.`);
}

function getTool(args: Record<string, unknown>) {
  const name = typeof args.name === "string" ? args.name : "";
  if (!name.trim()) return toolText("Pass a component name, such as conversation.", true);
  const item = findCatalogItem(name);
  if (!item) {
    return toolText(`No component named "${name}". Use search_components first.`, true);
  }
  const sources = readItemSource(item);
  const sourceBlocks = sources
    .map((file) => `### ${file.target}\n\n\`\`\`tsx\n${file.content}\n\`\`\``)
    .join("\n\n");
  const deps = item.dependencies.length > 0 ? item.dependencies.join(", ") : "none";
  const registryDeps = item.registryDependencies.length > 0 ? item.registryDependencies.join(", ") : "none";
  return toolText(
    [
      `# ${item.title}`,
      "",
      item.description,
      "",
      `Registry name: ${item.name}`,
      `Category: ${item.category}`,
      `Install: ${item.install}`,
      `Registry JSON: ${item.pageUrl}`,
      `Dependencies: ${deps}`,
      `Registry dependencies: ${registryDeps}`,
      "",
      sourceBlocks,
    ].join("\n"),
  );
}

function callTool(name: string, args: unknown) {
  const record = isRecord(args) ? args : {};
  if (!isToolName(name)) return toolText(`Unknown tool: ${name}`, true);
  switch (name) {
    case "list_components":
      return listTool();
    case "search_components":
      return searchTool(record);
    case "get_component":
      return getTool(record);
    case "get_source":
      return sourceTool(record);
    default: {
      const unreachable: never = name;
      return unreachable;
    }
  }
}

function protocolVersion(params: unknown): string {
  if (!isRecord(params) || typeof params.protocolVersion !== "string") return PROTOCOL_VERSIONS[0];
  return PROTOCOL_VERSIONS.includes(params.protocolVersion as (typeof PROTOCOL_VERSIONS)[number])
    ? params.protocolVersion
    : PROTOCOL_VERSIONS[0];
}

function handleRequest(message: JsonRpcRequest): unknown {
  const id = message.id ?? null;
  switch (message.method) {
    case "initialize":
      return rpcResult(id, {
        protocolVersion: protocolVersion(message.params),
        capabilities: {
          tools: { listChanged: false },
          resources: { listChanged: false },
        },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        instructions:
          "Screen is a free registry of React components for AI products, styled with Tailwind. Call search_components or list_components, then get_component or get_source. Install with the shadcn command in the result. No access key is required.",
      });
    case "ping":
      return rpcResult(id, {});
    case "tools/list":
      return rpcResult(id, { tools: TOOLS });
    case "tools/call": {
      const params = isRecord(message.params) ? message.params : {};
      const name = typeof params.name === "string" ? params.name : "";
      return rpcResult(id, callTool(name, params.arguments));
    }
    case "resources/list":
      return rpcResult(id, {
        resources: [
          {
            uri: "solokit://llms.txt",
            name: "llms.txt",
            description: "Plain-text index of every Screen component and its install command.",
            mimeType: "text/plain",
          },
        ],
      });
    case "resources/read": {
      const params = isRecord(message.params) ? message.params : {};
      const uri = typeof params.uri === "string" ? params.uri : "";
      if (uri !== "solokit://llms.txt") {
        return rpcError(id, -32002, `Unknown resource: ${uri}`);
      }
      return rpcResult(id, {
        contents: [{ uri, mimeType: "text/plain", text: renderLlmsTxt() }],
      });
    }
    case "prompts/list":
      return rpcResult(id, { prompts: [] });
    default:
      return rpcError(id, -32601, `Method not found: ${message.method ?? ""}`);
  }
}

function handleOne(message: unknown): unknown | null {
  if (!isRecord(message) || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    const id = isRecord(message) && (typeof message.id === "string" || typeof message.id === "number") ? message.id : null;
    return rpcError(id, -32600, "Invalid Request");
  }
  if (!("id" in message)) return null;
  return handleRequest(message as JsonRpcRequest);
}

export function handleMcpHttp(raw: string): { status: number; body?: unknown } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return { status: 400, body: rpcError(null, -32700, "Parse error") };
  }

  if (Array.isArray(parsed)) {
    const results = parsed.map(handleOne).filter((entry) => entry !== null);
    if (results.length === 0) return { status: 202 };
    return { status: 200, body: results };
  }

  const result = handleOne(parsed);
  if (result === null) return { status: 202 };
  return { status: 200, body: result };
}
