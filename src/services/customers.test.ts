import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { listZellerCustomers } from "./customers";
import * as client from "../lib/graphqlClient";

describe("listZellerCustomers", () => {
  const spy = vi.spyOn(client, "graphqlFetch");

  afterEach(() => {
    spy.mockReset();
  });

  it("maps and normalizes roles", async () => {
    spy.mockResolvedValueOnce({
      listZellerCustomers: {
        items: [
          { id: "1", name: "A", email: "a@x.com", role: "admin" },
          { id: "2", name: "B", email: "b@x.com", role: "Manager" },
        ],
      },
    } as any);

    const result = await listZellerCustomers();
    expect(result).toEqual([
      { id: "1", name: "A", email: "a@x.com", role: "Admin" },
      { id: "2", name: "B", email: "b@x.com", role: "Manager" },
    ]);
  });

  it("filters invalid items", async () => {
    spy.mockResolvedValueOnce({
      listZellerCustomers: {
        items: [
          { id: "1", name: "A", email: "a@x.com", role: "admin" },
          { id: "", name: "", email: "", role: "" },
        ],
      },
    } as any);
    const result = await listZellerCustomers();
    expect(result.length).toBe(1);
  });
});
