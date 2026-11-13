import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPrompts(server: McpServer): void {
  server.prompt(
    "comparative_archetype_analysis",
    "Prompt template for comparing two deities or mythological figures across cultures using structural mythemes and semantic manifold distance.",
    {
      deity_a: z.string().describe("First deity name (e.g. 'Zeus' or 'Thor')"),
      deity_b: z.string().describe("Second deity name (e.g. 'Indra' or 'Perun')"),
      focus_theme: z.string().optional().describe("Optional thematic lens (e.g. 'sovereignty', 'dragon-slaying', 'divine blacksmithing')")
    },
    ({ deity_a, deity_b, focus_theme }) => {
      const themeInstruction = focus_theme
        ? `Focus specifically through the thematic lens of: "${focus_theme}".`
        : "Analyze shared structural propositions, contrasts in socio-religious function, and underlying archetype convergence.";

      return {
        description: `Comparative analysis of ${deity_a} vs. ${deity_b}`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please conduct a rigorous comparative mythology analysis between ${deity_a} and ${deity_b} using the Syncretica framework.\n\n` +
                `1. Query Syncretica using the 'search' and 'get_god' tools to retrieve their structured attributes and decomposed myth propositions.\n` +
                `2. Use 'find_counterparts' to check where each deity falls on the pgvector cosine distance manifold.\n` +
                `3. ${themeInstruction}\n` +
                `4. Cite specific mythemes, shared attributes, and geographic/historical context.`
            }
          }
        ]
      };
    }
  );

  server.prompt(
    "cross_cultural_synthesis",
    "Prompt template to draft an academic treatise based on Syncretica archetype clusters and frozen snapshots.",
    {
      snapshot_id: z.string().describe("ID of the frozen cluster snapshot to synthesize"),
      thematic_prompt: z.string().describe("Research hypothesis or scholarly inquiry to address")
    },
    ({ snapshot_id, thematic_prompt }) => {
      return {
        description: `Scholarly synthesis based on Snapshot #${snapshot_id}`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `You are an expert scholar of comparative mythology and computational archetypal analysis.\n\n` +
                `Research Inquiry: "${thematic_prompt}"\n\n` +
                `1. Inspect cluster snapshot #${snapshot_id} using 'get_cluster_snapshot' or resource 'syncretica://snapshots/${snapshot_id}'.\n` +
                `2. Examine the largest archetype groups and their constituent deities/myths.\n` +
                `3. Check if any synthesis reports exist via 'list_cluster_reports' or create a new report via 'create_cluster_report'.\n` +
                `4. Compose an academic monograph synthesizing the cross-cultural patterns with formal citations.`
            }
          }
        ]
      };
    }
  );
}
