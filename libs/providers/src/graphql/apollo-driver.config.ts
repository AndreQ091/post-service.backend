import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

export const apolloDriverConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(
    process.cwd(),
    'libs',
    'providers',
    'src',
    'graphql',
    'schema.gql',
  ),
  sortSchema: true,
  context: ({ req, res }) => ({ req, res }),
  formatError(error) {
    if ('response' in error.extensions) {
      const { message, ...response } = error.extensions.response as {
        message: string;
        response: object;
      };
      return {
        message,
        extensions: {
          timestamp: new Date().toISOString(),
          ...response,
        },
      };
    }
    return error;
  },
};
