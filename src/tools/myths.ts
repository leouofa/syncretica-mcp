import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SyncreticaApiClient } from "../client/index.js";

export function registerMythTools(server: McpServer, client: SyncreticaApiClient): void {
  server.tool(
    "list_myths",
    "List and filter mythologies with structured propositions and embedding metadata.",
    {
      god_id: z.number().int().positive().optional().describe("Filter by deity ID"),
      pantheon_id: z.number().int().positive().optional().describe("Filter by pantheon ID"),
      theme: z.string().optional().describe("Filter by theme key or proposition substring"),
      q: z.string().optional().describe("Keyword search across myth proposition texts"),
      include_embedding: z.boolean().optional().default(false).describe("Include raw 1024-float vector array"),
      limit: z.number().int().min(1).max(500).optional().default(50).describe("Pagination limit (default: 50)"),
      offset: z.number().int().min(0).optional().default(0).describe("Pagination offset (default: 0)")
    },
    async (params) => {
      try {
        const result = await client.listMyths(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to list myths: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "get_myth",
    "Retrieve details of a myth including its 8-10 decomposed themes and associated deity.",
    {
      id: z.number().int().positive().describe("Myth ID"),
      include_embedding: z.boolean().optional().default(false).describe("Include raw 1024-dim vector embedding")
    },
    async ({ id, include_embedding }) => {
      try {
        const myth = await client.getMyth(id, { include_embedding });
        return {
          content: [{ type: "text", text: JSON.stringify(myth, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to get myth ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "create_myth",
    "Create or upsert a myth proposition record for a deity.",
    {
      god_id: z.number().int().positive().describe("God ID"),
      themes: z.record(z.string(), z.string()).describe("Key-value map of myth propositions (e.g. {'Chaoskampf': 'Slays primordial dragon', 'Civic Order': 'Founds holy sanctuary'})")
    },
    async ({ god_id, themes }) => {
      try {
        const myth = await client.createMyth({ god_id, themes });
        return {
          content: [{ type: "text", text: JSON.stringify(myth, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to create myth: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "update_myth",
    "Update an existing myth's structured theme propositions.",
    {
      id: z.number().int().positive().describe("Myth ID"),
      themes: z.record(z.string(), z.string()).describe("Updated key-value map of myth propositions")
    },
    async ({ id, themes }) => {
      try {
        const myth = await client.updateMyth(id, { themes });
        return {
          content: [{ type: "text", text: JSON.stringify(myth, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to update myth ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "delete_myth",
    "Delete a myth record.",
    {
      id: z.number().int().positive().describe("Myth ID to delete")
    },
    async ({ id }) => {
      try {
        const res = await client.deleteMyth(id);
        return {
          content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to delete myth ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "generate_myth_embedding",
    "Calculate 1024-dimensional vector embedding for a myth record.",
    {
      id: z.number().int().positive().describe("Myth ID"),
      sync: z.boolean().optional().default(true).describe("If true, wait synchronously for embedding generation to finish")
    },
    async ({ id, sync }) => {
      try {
        const result = await client.generateMythEmbedding(id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to generate embedding for myth ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "populate_myths_bulk",
    "Trigger bulk myth discovery across all deities or a single deity.",
    {
      god_id: z.number().int().positive().optional().describe("Optional deity ID to scope discovery"),
      sync: z.boolean().optional().default(false).describe("If true, wait synchronously for completion")
    },
    async ({ god_id, sync }) => {
      try {
        const result = await client.populateMyths(god_id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to bulk populate myths: ${err.message || String(err)}` }]
        };
      }
    }
  );
}
