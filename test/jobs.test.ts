import { describe, it, expect, beforeEach, afterEach } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { SyncreticaApiClient } from "../src/client/index.js";

describe("Job polling (waitForJob)", () => {
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

  it("polls job until status becomes completed", async () => {
    let callCount = 0;
    mock.onGet("http://localhost:3000/api/v1/jobs/test-job-1").reply(() => {
      callCount++;
      if (callCount === 1) {
        return [200, { data: { job_id: "test-job-1", status: "running", progress: { current: 1, total: 10 } } }];
      }
      return [200, { data: { job_id: "test-job-1", status: "completed", result: { success: true } } }];
    });

    const job = await client.waitForJob("test-job-1", 10, 1000);
    expect(job.status).toBe("completed");
    expect(callCount).toBe(2);
  });

  it("throws when job status is failed", async () => {
    mock.onGet("http://localhost:3000/api/v1/jobs/failed-job").reply(200, {
      data: {
        job_id: "failed-job",
        status: "failed",
        error: "Ollama connection refused"
      }
    });

    await expect(client.waitForJob("failed-job", 10, 500)).rejects.toThrow("Ollama connection refused");
  });

  it("times out if job does not complete in time", async () => {
    mock.onGet("http://localhost:3000/api/v1/jobs/slow-job").reply(200, {
      data: { job_id: "slow-job", status: "running" }
    });

    await expect(client.waitForJob("slow-job", 20, 50)).rejects.toThrow("timed out");
  });
});
