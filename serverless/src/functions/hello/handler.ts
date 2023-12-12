import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const esDomainUrl = process.env.ES_DOMAIN_ENDPOINT || "";

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return formatJSONResponse({
    message: `esDomainUrl: ${esDomainUrl}`,
    event,
  });
};

export const main = middyfy(hello);
