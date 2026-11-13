import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SyncreticaApiClient } from "../client/index.js";

export function registerSearchTools(server: McpServer, client: SyncreticaApiClient): void {
  server.tool(
    "search",
    "Unified cross-catalog semantic or keyword search across deities and myths in the Syncretica comparative mythology manifold.",
    {
      q: z.string().describe("Search query text (e.g. 'solar thunder sovereign', 'underworld judgment')"),
      mode: z.enum(["semantic", "keyword", "auto"]).optional().default("auto").describe("Search mode: semantic (vector similarity), keyword (text matching), or auto"),
      target_type: z.enum(["all", "god", "myth"]).optional().default("all").describe("Filter search results by entity type: all, god, or myth"),
      limit: z.number().int().min(1).max(100).optional().default(20).describe("Maximum number of results to return (1-100)")
    },
    async ({ q, mode, target_type, limit }) => {
      try {
        const results = await client.search({ q, mode, target_type, limit });
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Search failed: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "find_counterparts",
    "Find nearest mythological counterparts to a specified god or myth using pgvector cosine distance across world pantheons.",
    {
      entity_type: z.enum(["god", "myth"]).describe("Entity type to find counterparts for: god or myth"),
      id: z.number().int().positive().describe("ID of the god or myth"),
      limit: z.number().int().min(1).max(50).optional().default(10).describe("Number of nearest neighbors to return"),
      pantheon_id: z.number().int().positive().optional().describe("Optional pantheon ID to filter counterpart candidates (for god counterparts)"),
      include_embedding: z.boolean().optional().default(false).describe("Whether to include raw 1024-float vector embeddings in results")
    },
    async ({ entity_type, id, limit, pantheon_id, include_embedding }) => {
      try {
        if (entity_type === "god") {
          const neighbors = await client.getGodNeighbors(id, { limit, pantheon_id, include_embedding });
          return {
            content: [{ type: "text", text: JSON.stringify(neighbors, null, 2) }]
          };
        } else {
          const neighbors = await client.getMythNeighbors(id, { limit, include_embedding });
          return {
            content: [{ type: "text", text: JSON.stringify(neighbors, null, 2) }]
          };
        }
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Finding counterparts failed: ${err.message || String(err)}` }]
        };
      }
    }
  );
}
