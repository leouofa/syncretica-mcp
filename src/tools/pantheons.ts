import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SyncreticaApiClient } from "../client/index.js";

export function registerPantheonTools(server: McpServer, client: SyncreticaApiClient): void {
  server.tool(
    "list_pantheons",
    "List world mythological pantheons registered in Syncretica with deity counts.",
    {
      q: z.string().optional().describe("Filter pantheons by name or description substring"),
      include_gods: z.boolean().optional().default(false).describe("Include deities associated with each pantheon"),
      limit: z.number().int().min(1).max(500).optional().default(50).describe("Pagination limit (default: 50)"),
      offset: z.number().int().min(0).optional().default(0).describe("Pagination offset (default: 0)")
    },
    async ({ q, include_gods, limit, offset }) => {
      try {
        const result = await client.listPantheons({ q, include_gods, limit, offset });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to list pantheons: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "get_pantheon",
    "Retrieve details of a single pantheon including its deity roster.",
    {
      id: z.number().int().positive().describe("Pantheon ID"),
      include_gods: z.boolean().optional().default(true).describe("Include deities associated with this pantheon")
    },
    async ({ id, include_gods }) => {
      try {
        const pantheon = await client.getPantheon(id, { include_gods });
        return {
          content: [{ type: "text", text: JSON.stringify(pantheon, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to get pantheon ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "create_pantheon",
    "Create a new pantheon record in the catalog.",
    {
      name: z.string().min(1).describe("Name of the pantheon (e.g. 'Etruscan', 'Hittite')"),
      description: z.string().optional().describe("Description of the culture, geographic origin, and traditions")
    },
    async ({ name, description }) => {
      try {
        const pantheon = await client.createPantheon({ name, description });
        return {
          content: [{ type: "text", text: JSON.stringify(pantheon, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to create pantheon: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "update_pantheon",
    "Update an existing pantheon's name or description.",
    {
      id: z.number().int().positive().describe("Pantheon ID"),
      name: z.string().optional().describe("Updated pantheon name"),
      description: z.string().optional().describe("Updated description")
    },
    async ({ id, name, description }) => {
      try {
        const pantheon = await client.updatePantheon(id, { name, description });
        return {
          content: [{ type: "text", text: JSON.stringify(pantheon, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to update pantheon ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "delete_pantheon",
    "Delete a pantheon and its cascaded deities and myths.",
    {
      id: z.number().int().positive().describe("Pantheon ID to delete")
    },
    async ({ id }) => {
      try {
        const res = await client.deletePantheon(id);
        return {
          content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to delete pantheon ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "upsert_pantheons_batch",
    "Batch insert or update pantheons matching case-insensitively on name.",
    {
      pantheons: z.array(z.object({
        name: z.string().min(1),
        description: z.string().optional()
      })).min(1).describe("Array of pantheons to upsert")
    },
    async ({ pantheons }) => {
      try {
        const result = await client.upsertPantheonsBatch(pantheons);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to upsert pantheons: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "populate_pantheons",
    "Trigger LLM discovery to identify and populate global pantheons.",
    {
      sync: z.boolean().optional().default(false).describe("If true, wait synchronously for discovery to complete")
    },
    async ({ sync }) => {
      try {
        const result = await client.populatePantheons(sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to populate pantheons: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "populate_pantheon_gods",
    "Discover and populate deities for a specific pantheon via LLM generation.",
    {
      id: z.number().int().positive().describe("Pantheon ID"),
      sync: z.boolean().optional().default(true).describe("If true, wait synchronously for deity generation to finish")
    },
    async ({ id, sync }) => {
      try {
        const result = await client.populatePantheonGods(id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to populate gods for pantheon ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );
}
