import { describe, it, expect, beforeEach, afterEach } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { SyncreticaApiClient, SyncreticaApiError } from "../src/client/index.js";

describe("SyncreticaApiClient", () => {
  let mock: MockAdapter;
  let client: SyncreticaApiClient;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    client = new SyncreticaApiClient({
      apiUrl: "http://localhost:3000/api/v1",
      timeoutMs: 5000
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it("fetches platform status successfully", async () => {
    const mockStatus = {
      status: "ok",
      environment: "test",
      timestamp: "2026-11-13T00:00:00Z",
      counts: { pantheons: 10, gods: 100, gods_embedded: 100, myths: 100, myths_embedded: 100, cluster_snapshots: 2, cluster_reports: 1 },
      config: {
        embedding_model: "qwen3-embedding",
        embedding_api_base: "http://localhost:11434/v1",
        embedding_dimensions: 1024,
        llm_model: "Qwen3.6",
        llm_api_base: "http://localhost:11434/v1",
        context_window: 131072,
        digest_char_budget: 200000
      }
    };

    mock.onGet("http://localhost:3000/api/v1/status").reply(200, { data: mockStatus });

    const status = await client.getStatus();
    expect(status.status).toBe("ok");
    expect(status.counts.gods).toBe(100);
  });

  it("handles 404 not found errors cleanly", async () => {
    mock.onGet("http://localhost:3000/api/v1/gods/999").reply(404, {
      error: { code: "not_found", message: "Couldn't find God with 'id'=999" }
    });

    await expect(client.getGod(999)).rejects.toThrowError(SyncreticaApiError);
    try {
      await client.getGod(999);
    } catch (err: any) {
      expect(err.code).toBe("not_found");
      expect(err.status).toBe(404);
      expect(err.message).toContain("Couldn't find God");
    }
  });

  it("performs unified semantic search", async () => {
    const mockResults = [
      { id: 1, type: "God", name: "Zeus", similarity_score: 0.92 }
    ];

    mock.onGet("http://localhost:3000/api/v1/search", {
      params: { q: "lightning", mode: "semantic", limit: 5 }
    }).reply(200, { data: mockResults, meta: { total: 1 } });

    const res = await client.search({ q: "lightning", mode: "semantic", limit: 5 });
    expect(res.data).toEqual(mockResults);
  });

  it("finds deity counterparts via neighbors endpoint", async () => {
    const mockNeighbors = [
      { id: 2, name: "Thor", neighbor_distance: 0.08 }
    ];

    mock.onGet("http://localhost:3000/api/v1/gods/1/neighbors", {
      params: { limit: 5 }
    }).reply(200, { data: mockNeighbors });

    const neighbors = await client.getGodNeighbors(1, { limit: 5 });
    expect(neighbors).toHaveLength(1);
    expect(neighbors[0].name).toBe("Thor");
  });

  it("computes live clustering", async () => {
    const mockClusters = {
      target_type: "God",
      level: 5,
      distance_threshold: 0.28,
      full_coverage: false,
      total_embedded_count: 100,
      unembedded_count: 0,
      clusters_count: 12,
      singletons_count: 15,
      largest_cluster_size: 14,
      generated_at: "2026-11-13T00:00:00Z",
      clusters: [],
      singletons: []
    };

    mock.onGet("http://localhost:3000/api/v1/clusters", {
      params: { target_type: "God", level: 5 }
    }).reply(200, { data: mockClusters });

    const clusters = await client.computeClusters({ target_type: "God", level: 5 });
    expect(clusters.clusters_count).toBe(12);
    expect(clusters.distance_threshold).toBe(0.28);
  });
});
