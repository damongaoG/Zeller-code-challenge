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
  options?: { timeoutMs?: number; retries?: number },
): Promise<TResult> {
  const { aws_appsync_graphqlEndpoint, aws_appsync_apiKey } = awsconfig;

  const timeout = options?.timeoutMs ?? 15000;
  const retries = options?.retries ?? 0;

  const attempt = async (): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const fetchPromise = fetch(aws_appsync_graphqlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": aws_appsync_apiKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      // Ensure we reject promptly when aborted, even if mocked fetch doesn't respect AbortSignal
      const abortPromise = new Promise<Response>((_, reject) => {
        controller.signal.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
      });

      return (await Promise.race([fetchPromise, abortPromise])) as Response;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  let lastError: unknown;
  for (let attemptIndex = 0; attemptIndex <= retries; attemptIndex++) {
    try {
      const resp = await attempt();
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
    } catch (err) {
      lastError = err;
      const isAbort = err instanceof DOMException && err.name === "AbortError";
      const isLastAttempt = attemptIndex === retries;
      if (isAbort || isLastAttempt) break;
      const delayMs = Math.min(1000 * 2 ** attemptIndex, 4000);
      await new Promise((r) => setTimeout(r, delayMs));
      continue;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
