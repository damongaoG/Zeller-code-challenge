import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { graphqlFetch } from "./graphqlClient";

const originalFetch = global.fetch;

describe("graphqlFetch", () => {
  beforeEach(() => {
    // @ts-expect-error override fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns data on success", async () => {
    // @ts-expect-error mock
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { hello: "world" } }),
    });
    const data = await graphqlFetch<{ hello: string }>({ query: "q" });
    expect(data).toEqual({ hello: "world" });
  });

  it("throws on http error", async () => {
    // @ts-expect-error mock
    global.fetch.mockResolvedValueOnce({ ok: false, text: async () => "bad" });
    await expect(graphqlFetch({ query: "q" })).rejects.toThrow(
      /GraphQL request failed/i,
    );
  });

  it("honors timeout", async () => {
    // Never resolves; ensure abort triggers
    // @ts-expect-error mock
    global.fetch.mockImplementationOnce(
      () =>
        new Promise(() => {
          /* never */
        }),
    );
    await expect(
      graphqlFetch({ query: "q" }, { timeoutMs: 10 }),
    ).rejects.toBeInstanceOf(Error);
  });
});
