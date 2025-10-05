import { graphqlFetch } from "../lib/graphqlClient";
import { ListZellerCustomers } from "./../graphql/queries";

export type ZellerCustomer = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager";
};

type ListZellerCustomersResult = {
  listZellerCustomers: {
    items: ZellerCustomer[];
  };
};

export async function listZellerCustomers(): Promise<ZellerCustomer[]> {
  const data = await graphqlFetch<ListZellerCustomersResult>(
    {
      query: ListZellerCustomers,
    },
    undefined,
  );
  const items = data.listZellerCustomers?.items ?? [];

  // Normalize role casing from API
  const normalizeRole = (role: string): "Admin" | "Manager" => {
    const lower = String(role).toLowerCase();
    if (lower === "admin") return "Admin";
    if (lower === "manager") return "Manager";
    return "Manager";
  };

  return items
    .filter((i): i is ZellerCustomer =>
      Boolean(i && i.id && i.name && i.email && i.role),
    )
    .map((i) => ({
      id: i.id,
      name: i.name,
      email: i.email,
      role: normalizeRole((i as unknown as { role: string }).role),
    }));
}
