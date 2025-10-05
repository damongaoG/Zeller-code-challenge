import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import UserAdminPanel from "./UserAdminPanel";
import * as svc from "../services/customers";

describe("UserAdminPanel", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders items", async () => {
    vi.spyOn(svc, "listZellerCustomers").mockResolvedValueOnce([
      { id: "1", name: "Alice", email: "a@x.com", role: "Admin" },
      { id: "2", name: "Bob", email: "b@x.com", role: "Manager" },
    ]);

    render(<UserAdminPanel />);
    expect(screen.getByText(/User Types/i)).toBeInTheDocument();

    expect(await screen.findByText("Alice")).toBeInTheDocument();
  });

  it("renders error alert on failure", async () => {
    vi.spyOn(svc, "listZellerCustomers").mockRejectedValueOnce(
      new Error("boom"),
    );
    render(<UserAdminPanel />);
    expect(await screen.findByRole("alert")).toHaveTextContent("boom");
  });
});
