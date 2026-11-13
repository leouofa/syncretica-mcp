import dotenv from "dotenv";

dotenv.config();

export interface ServerConfig {
  apiUrl: string;
  apiKey?: string;
  timeoutMs: number;
}

export function parseArgs(argv: string[] = process.argv.slice(2)): Partial<ServerConfig> & { showHelp?: boolean } {
  const result: Partial<ServerConfig> & { showHelp?: boolean } = {};
  
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      result.showHelp = true;
    } else if (arg === "--url" || arg === "-u") {
      result.apiUrl = argv[++i];
    } else if (arg === "--api-key" || arg === "-k") {
      result.apiKey = argv[++i];
    } else if (arg === "--timeout" || arg === "-t") {
      const ms = parseInt(argv[++i], 10);
      if (!isNaN(ms) && ms > 0) {
        result.timeoutMs = ms;
      }
    }
  }
  
  return result;
}

export function loadConfig(argv: string[] = process.argv.slice(2)): ServerConfig & { showHelp?: boolean } {
  const args = parseArgs(argv);
  
  const envUrl = process.env.SYNCRETICA_API_URL;
  const envKey = process.env.SYNCRETICA_API_KEY;
  const envTimeout = process.env.SYNCRETICA_TIMEOUT_MS ? parseInt(process.env.SYNCRETICA_TIMEOUT_MS, 10) : undefined;

  const apiUrl = (args.apiUrl || envUrl || "http://localhost:3000/api/v1").replace(/\/+$/, "");
  const apiKey = args.apiKey || envKey || undefined;
  const timeoutMs = args.timeoutMs || (!isNaN(envTimeout as number) && (envTimeout as number) > 0 ? (envTimeout as number) : 60000);

  return {
    apiUrl,
    apiKey,
    timeoutMs,
    showHelp: args.showHelp
  };
}

export const HELP_TEXT = `
Syncretica Model Context Protocol (MCP) Server

Usage:
  syncretica-mcp [options]

Options:
  -u, --url <url>        Syncretica API base URL (default: http://localhost:3000/api/v1)
  -k, --api-key <key>    Optional API key / Bearer token
  -t, --timeout <ms>     Request timeout in milliseconds (default: 60000)
  -h, --help             Display this help message

Environment Variables:
  SYNCRETICA_API_URL     Syncretica API base URL
  SYNCRETICA_API_KEY     Optional API key / Bearer token
  SYNCRETICA_TIMEOUT_MS  Request timeout in milliseconds
`;
