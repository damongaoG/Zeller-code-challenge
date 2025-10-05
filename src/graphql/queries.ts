/* eslint-disable */
// Centralized GraphQL queries
export const ListZellerCustomers = /* GraphQL */ `
  query ListZellerCustomers {
    listZellerCustomers {
      items {
        email
        id
        name
        role
      }
    }
  }
`;
