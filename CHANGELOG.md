# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-12

### Added
- **MCP Server Core**: Production-ready Model Context Protocol (MCP) TypeScript server communicating over standard I/O (`StdioServerTransport`) using `@modelcontextprotocol/sdk`.
- **Search & Vector Manifold**:
  - `search`: Global semantic and keyword search across pantheons, gods, and myth propositions.
  - `find_counterparts`: Nearest structural counterpart identification via 1024-dimensional pgvector cosine distance.
- **Entity Management (CRUD & Batch)**:
  - Pantheons: `list_pantheons`, `get_pantheon`, `create_pantheon`, `update_pantheon`, `delete_pantheon`, `upsert_pantheons_batch`, `populate_pantheons`, `populate_pantheon_gods`.
  - Gods: `list_gods`, `get_god`, `create_god`, `update_god`, `delete_god`, `upsert_gods_batch`, `generate_god_embedding`, `populate_god_myth`, `populate_gods_bulk`.
  - Myths: `list_myths`, `get_myth`, `create_myth`, `update_myth`, `delete_myth`, `generate_myth_embedding`, `populate_myths_bulk`.
- **Archetype Clustering & Snapshots**:
  - `compute_clusters`: Dynamic connected-components vector clustering with configurable threshold levels (1–15) and full coverage flags.
  - Cluster Snapshots: `create_cluster_snapshot`, `list_cluster_snapshots`, `get_cluster_snapshot`, `delete_cluster_snapshot`, and `get_cluster_group`.
- **Synthesis Monograph Reports**:
  - `create_cluster_report`: 2-phase Map-Reduce scholarly synthesis on cluster snapshots.
  - `generate_deep_synthesis`: 3-phase Hierarchical Deep Synthesis monograph generation with intermediate batch syntheses.
  - Report inspection: `list_cluster_reports`, `get_cluster_report`, `get_report_summary`, `get_report_sub_report`.
- **Asynchronous Execution & Job Polling**:
  - Dedicated background job monitoring tools: `get_job_status` and `list_jobs`.
  - `wait_for_job`: Configurable polling utility for tracking long-running asynchronous jobs to completion.
- **System Administration & Settings**:
  - `get_platform_status`, `get_settings`, `update_context_window`, `trigger_bulk_embeddings`, `get_openapi_spec`.
- **MCP Resources**:
  - `syncretica://status`: Platform health, entity metrics, and active LLM configuration.
  - `syncretica://pantheons`: World tradition catalog overview and deity counts.
  - `syncretica://snapshots/{id}`: Detailed cluster groups and members of frozen snapshots.
  - `syncretica://reports/{id}`: Full compiled markdown text of scholarly monographs.
- **MCP Prompts**:
  - `comparative_archetype_analysis`: Structured cross-tradition comparative deity inquiry.
  - `cross_cultural_synthesis`: Multi-phase synthesis monograph drafting prompt.
- **Test Suite**: Vitest automated test suite covering configuration parsing, Axios API client contracts, error envelopes, ActiveJob polling loops, and tool/resource/prompt schema validation.
