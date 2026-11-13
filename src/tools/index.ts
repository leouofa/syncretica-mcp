import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SyncreticaApiClient } from "../client/index.js";
import { registerSearchTools } from "./search.js";
import { registerPantheonTools } from "./pantheons.js";
import { registerGodTools } from "./gods.js";
import { registerMythTools } from "./myths.js";
import { registerClusterTools } from "./clusters.js";
import { registerReportTools } from "./reports.js";
import { registerJobTools } from "./jobs.js";
import { registerSystemTools } from "./system.js";

export function registerAllTools(server: McpServer, client: SyncreticaApiClient): void {
  registerSearchTools(server, client);
  registerPantheonTools(server, client);
  registerGodTools(server, client);
  registerMythTools(server, client);
  registerClusterTools(server, client);
  registerReportTools(server, client);
  registerJobTools(server, client);
  registerSystemTools(server, client);
}
