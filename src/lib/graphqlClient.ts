import awsconfig from "../aws-exports";

type GraphQLRequest = {
  query: string;
  variables?: Record<string, unknown>;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{
    message: string;
    errorType?: string;
    path?: (string | number)[];
    extensions?: Record<string, unknown>;
  }>;
};

/**
 * Fetch API and API key auth
 * @param body
 * @returns
 */
export async function graphqlFetch<TResult>(
  body: GraphQLRequest,
): Promise<TResult> {
  const { aws_appsync_graphqlEndpoint, aws_appsync_apiKey } = awsconfig;

  const resp = await fetch(aws_appsync_graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": aws_appsync_apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`GraphQL request failed: ${text}`);
  }

  const json = (await resp.json()) as GraphQLResponse<TResult>;

  if (json.errors && json.errors.length > 0) {
    const combined = json.errors.map((e) => e.message).join(" | ");
    throw new Error(`GraphQL Error: ${combined}`);
  }

  if (!json.data) {
    throw new Error(`GraphQL Error: No data returned`);
  }

  return json.data;
}
