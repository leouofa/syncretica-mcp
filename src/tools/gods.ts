import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SyncreticaApiClient } from "../client/index.js";

export function registerGodTools(server: McpServer, client: SyncreticaApiClient): void {
  server.tool(
    "list_gods",
    "List and filter deities with thematic tags and vector embedding status.",
    {
      pantheon_id: z.number().int().positive().optional().describe("Filter by pantheon ID"),
      pantheon: z.string().optional().describe("Filter by pantheon name substring"),
      theme: z.string().optional().describe("Filter deities containing thematic tag (e.g. 'thunder', 'wisdom')"),
      q: z.string().optional().describe("Search name or description substring"),
      embedded: z.boolean().optional().describe("Filter by whether vector embedding has been generated"),
      include_myth: z.boolean().optional().default(false).describe("Include associated myth propositions"),
      include_embedding: z.boolean().optional().default(false).describe("Include raw 1024-float vector array"),
      limit: z.number().int().min(1).max(500).optional().default(50).describe("Pagination limit (default: 50)"),
      offset: z.number().int().min(0).optional().default(0).describe("Pagination offset (default: 0)")
    },
    async (params) => {
      try {
        const result = await client.listGods(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to list gods: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "get_god",
    "Retrieve full profile of a deity including pantheon, thematic attributes, and myth propositions.",
    {
      id: z.number().int().positive().describe("God ID"),
      include_myth: z.boolean().optional().default(true).describe("Include decomposed myth themes"),
      include_embedding: z.boolean().optional().default(false).describe("Include raw 1024-dim vector embedding")
    },
    async ({ id, include_myth, include_embedding }) => {
      try {
        const god = await client.getGod(id, { include_myth, include_embedding });
        return {
          content: [{ type: "text", text: JSON.stringify(god, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to get god ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "create_god",
    "Create a new deity record associated with a pantheon.",
    {
      pantheon_id: z.number().int().positive().describe("Pantheon ID"),
      name: z.string().min(1).describe("Name of the deity"),
      description: z.string().optional().describe("Scholarly description and divine roles"),
      themes: z.array(z.string()).optional().describe("Thematic tags (e.g. ['thunder', 'war', 'sky'])")
    },
    async ({ pantheon_id, name, description, themes }) => {
      try {
        const god = await client.createGod({ pantheon_id, name, description, themes });
        return {
          content: [{ type: "text", text: JSON.stringify(god, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to create god: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "update_god",
    "Update an existing deity's attributes, pantheon, or thematic tags.",
    {
      id: z.number().int().positive().describe("God ID"),
      name: z.string().optional().describe("Updated deity name"),
      description: z.string().optional().describe("Updated description"),
      themes: z.array(z.string()).optional().describe("Updated themes"),
      pantheon_id: z.number().int().positive().optional().describe("Reassign to a different pantheon ID")
    },
    async ({ id, name, description, themes, pantheon_id }) => {
      try {
        const god = await client.updateGod(id, { name, description, themes, pantheon_id });
        return {
          content: [{ type: "text", text: JSON.stringify(god, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to update god ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "delete_god",
    "Delete a deity and its associated myth record.",
    {
      id: z.number().int().positive().describe("God ID to delete")
    },
    async ({ id }) => {
      try {
        const res = await client.deleteGod(id);
        return {
          content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to delete god ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "upsert_gods_batch",
    "Batch insert or update deities scoped to a specific pantheon.",
    {
      pantheon_id: z.number().int().positive().describe("Pantheon ID"),
      gods: z.array(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        themes: z.array(z.string()).optional()
      })).min(1).describe("Array of deities to upsert")
    },
    async ({ pantheon_id, gods }) => {
      try {
        const result = await client.upsertGodsBatch(pantheon_id, gods);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to batch upsert gods: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "generate_god_embedding",
    "Calculate 1024-dimensional vector embedding for a deity using the configured embedding model.",
    {
      id: z.number().int().positive().describe("God ID"),
      sync: z.boolean().optional().default(true).describe("If true, wait synchronously for embedding generation to finish")
    },
    async ({ id, sync }) => {
      try {
        const result = await client.generateGodEmbedding(id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to generate embedding for god ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "populate_god_myth",
    "Generate 8-10 structured mythological themes for a deity via LLM extraction.",
    {
      id: z.number().int().positive().describe("God ID"),
      sync: z.boolean().optional().default(true).describe("If true, wait synchronously for myth generation to complete")
    },
    async ({ id, sync }) => {
      try {
        const result = await client.populateGodMyth(id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to populate myth for god ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "populate_gods_bulk",
    "Trigger bulk LLM discovery across all or a single pantheon.",
    {
      pantheon_id: z.number().int().positive().optional().describe("Optional pantheon ID to scope bulk discovery"),
      sync: z.boolean().optional().default(false).describe("If true, wait synchronously for completion")
    },
    async ({ pantheon_id, sync }) => {
      try {
        const result = await client.populateGods(pantheon_id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to populate gods in bulk: ${err.message || String(err)}` }]
        };
      }
    }
  );
}
