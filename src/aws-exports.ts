// Load AppSync config from environment variables
const awsconfig = {
  aws_appsync_graphqlEndpoint: import.meta.env
    .VITE_AWS_APPSYNC_GRAPHQL_ENDPOINT as string,
  aws_appsync_region: import.meta.env.VITE_AWS_APPSYNC_REGION as string,
  aws_appsync_authenticationType: "API_KEY" as const,
  aws_appsync_apiKey: import.meta.env.VITE_AWS_APPSYNC_API_KEY as string,
} as const;

export type AwsConfig = typeof awsconfig;
export default awsconfig;
