# Syncretica Model Context Protocol (MCP) Server

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-1.x-orange.svg)](https://modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-ready [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server interfacing with the **[Syncretica](https://github.com/leouofa/syncretica)** comparative mythology platform (`/api/v1` REST API).

Syncretica MCP allows AI agents (in Antigravity, Claude Desktop, Cursor, and custom agent harnesses) to seamlessly navigate, search, cluster, and synthesize cross-cultural mythological datasets, pgvector cosine distance manifolds, and multi-stage LLM synthesis reports.

---

## Capabilities Overview

```
                      +---------------------------------------+
                      | AI Agent (Claude, Antigravity, etc.)  |
                      +-------------------+-------------------+
                                          |
                                    stdio | JSON-RPC
                                          v
                      +---------------------------------------+
                      |       Syncretica MCP Server           |
                      |   - 28 Tools (Search, CRUD, ML)       |
                      |   - 4 Resources (Status, Reports)     |
                      |   - 2 Analysis Prompts                |
                      +-------------------+-------------------+
                                          |
                                     HTTP | REST (/api/v1)
                                          v
                      +---------------------------------------+
                      |         Syncretica API (Rails)        |
                      |   - pgvector 1024-dim Manifold        |
                      |   - Connected-Components Clustering   |
                      |   - Multi-phase Synthesis Engine      |
                      +---------------------------------------+
```

### 1. Global Search & Manifold Traversal
- **`search`**: Unified semantic or keyword search across world pantheons, deities, and myth propositions.
- **`find_counterparts`**: Identifies nearest structural counterparts to any god or myth using 1024-dimensional vector cosine distance.

### 2. Mythological Catalog Management (CRUD)
- **Pantheons**: `list_pantheons`, `get_pantheon`, `create_pantheon`, `update_pantheon`, `delete_pantheon`, `upsert_pantheons_batch`, `populate_pantheons`, `populate_pantheon_gods`.
- **Gods**: `list_gods`, `get_god`, `create_god`, `update_god`, `delete_god`, `upsert_gods_batch`, `generate_god_embedding`, `populate_god_myth`, `populate_gods_bulk`.
- **Myths**: `list_myths`, `get_myth`, `create_myth`, `update_myth`, `delete_myth`, `generate_myth_embedding`, `populate_myths_bulk`.

### 3. Archetype Clustering & Snapshots
- **`compute_clusters`**: Dynamically calculates connected-components vector clusters across catalog entities with configurable threshold levels (1–15) and full coverage flags without modifying the database.
- **`create_cluster_snapshot`**: Computes and freezes clustering into an immutable database snapshot.
- **`list_cluster_snapshots`**, **`get_cluster_snapshot`**, **`delete_cluster_snapshot`**, **`get_cluster_group`**.

### 4. Scholarly Synthesis Monograph Reports
- **`create_cluster_report`**: Triggers a 2-Phase Map-Reduce synthesis report on a snapshot with a custom research inquiry.
- **`generate_deep_synthesis`**: Initiates a 3-Phase Hierarchical Deep Synthesis monograph, grouping Phase 1 summaries into intermediate batch analyses.
- **`list_cluster_reports`**, **`get_cluster_report`**, **`get_report_summary`**, **`get_report_sub_report`**.

### 5. Background Jobs & Execution Control
- **`get_job_status`**, **`list_jobs`**: Inspect ActiveJob lifecycle states.
- **`wait_for_job`**: Polls asynchronous operations until completion or failure with configurable intervals and timeouts.

### 6. System & Settings
- **`get_platform_status`**: Platform health, entity counts, embedding coverage stats, and active LLM configuration.
- **`get_settings`**, **`update_context_window`**, **`trigger_bulk_embeddings`**, **`get_openapi_spec`**.

---

## MCP Resources

Directly inspectable URIs that AI agents can mount into context:
- `syncretica://status`: Platform health, entity metrics, and active LLM models.
- `syncretica://pantheons`: Catalog overview of all registered world traditions and deity counts.
- `syncretica://snapshots/{id}`: Detailed cluster groups and members of a frozen snapshot.
- `syncretica://reports/{id}`: Full compiled markdown text of a scholarly synthesis monograph.

---

## Comparative Mythology Prompts

- `comparative_archetype_analysis`: Structured inquiry comparing two deities across traditions using mythemes and semantic similarity.
- `cross_cultural_synthesis`: Guides the model to draft an academic treatise based on frozen cluster snapshots.

---

## Installation & Setup

### Prerequisites
- Node.js >= 18.0.0
- A running Syncretica instance (default: `http://localhost:3000/api/v1`)

### 1. Build from Source
```bash
git clone https://github.com/leouofa/syncretica-mcp.git
cd syncretica-mcp
npm install
npm run build
```

### 2. Environment Configuration
Create a `.env` file or export environment variables:
```bash
SYNCRETICA_API_URL=http://localhost:3000/api/v1
# SYNCRETICA_API_KEY=your_optional_token
SYNCRETICA_TIMEOUT_MS=60000
```

---

## Client Integration Examples

### Claude Desktop
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "syncretica": {
      "command": "node",
      "args": [
        "/absolute/path/to/syncretica-mcp/dist/index.js"
      ],
      "env": {
        "SYNCRETICA_API_URL": "http://localhost:3000/api/v1"
      }
    }
  }
}
```

### Antigravity / Gemini CLI / Cursor
Add to your client configuration:
```json
{
  "mcpServers": {
    "syncretica": {
      "command": "npx",
      "args": ["-y", "tsx", "/absolute/path/to/syncretica-mcp/src/index.ts"],
      "env": {
        "SYNCRETICA_API_URL": "http://localhost:3000/api/v1"
      }
    }
  }
}
```

---

## CLI Options

```
Usage:
  syncretica-mcp [options]

Options:
  -u, --url <url>        Syncretica API base URL (default: http://localhost:3000/api/v1)
  -k, --api-key <key>    Optional API key / Bearer token
  -t, --timeout <ms>     Request timeout in milliseconds (default: 60000)
  -h, --help             Display help message
```

---

## Development & Testing

```bash
# Run unit and integration test suite
npm test

# Run tests in watch mode
npm run test:watch

# Compile TypeScript
npm run build

# Start server directly in development
npm run dev
```

---

## License

MIT © [Leonid Medovyy](https://github.com/leouofa)
