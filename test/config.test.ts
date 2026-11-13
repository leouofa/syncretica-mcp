import { describe, it, expect } from "vitest";
import { parseArgs, loadConfig } from "../src/config.js";

describe("Config parsing", () => {
  it("parses CLI flags correctly", () => {
    const args = parseArgs(["--url", "http://api.example.com/api/v1", "--timeout", "5000", "--api-key", "secret-token"]);
    expect(args.apiUrl).toBe("http://api.example.com/api/v1");
    expect(args.timeoutMs).toBe(5000);
    expect(args.apiKey).toBe("secret-token");
  });

  it("handles short flags correctly", () => {
    const args = parseArgs(["-u", "http://short.example.com", "-t", "3000", "-k", "my-key"]);
    expect(args.apiUrl).toBe("http://short.example.com");
    expect(args.timeoutMs).toBe(3000);
    expect(args.apiKey).toBe("my-key");
  });

  it("detects help flag", () => {
    expect(parseArgs(["--help"]).showHelp).toBe(true);
    expect(parseArgs(["-h"]).showHelp).toBe(true);
  });

  it("falls back to default URL when no args or env provided", () => {
    const config = loadConfig([]);
    expect(config.apiUrl).toContain("http://localhost:3000/api/v1");
    expect(config.timeoutMs).toBe(60000);
  });
});
