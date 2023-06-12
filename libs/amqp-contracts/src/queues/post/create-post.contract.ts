import { EXCHANGE_POST } from '@amqp/amqp-contracts/exchanges';
import {
  AmqpBaseResponse,
  QueueDeclaration,
} from '@amqp/amqp-contracts/shared';
import { AmqpBaseRequest } from '../../shared/amqp-base-request.interface';
import { CreatePostRequest, CreatePostResponse } from '../interfaces';

export namespace CreatePostContract {
  export const queue: QueueDeclaration = {
    exchange: EXCHANGE_POST,
    routingKey: `${EXCHANGE_POST.name}-create`,
    queue: `${EXCHANGE_POST.name}-create`,
    queueOptions: {
      durable: true,
    },
  };

  export type request = AmqpBaseRequest<CreatePostRequest>;

  export type response = AmqpBaseResponse<CreatePostResponse>;
}
