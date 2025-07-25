import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

const client = new ApolloClient({
  link: createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
    headers: {
      "GraphQL-Preflight": "1",
    },
  }),
  cache: new InMemoryCache(),
});

export default client;