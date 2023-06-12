import { CreatePostContract } from '@amqp/amqp-contracts';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { PostFacade } from '@lib/post/application-services';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);

  constructor(private readonly postFacade: PostFacade) {}

  @RabbitRPC({
    exchange: CreatePostContract.queue.exchange.name,
    routingKey: CreatePostContract.queue.routingKey,
    queue: CreatePostContract.queue.queue,
  })
  private async createPost(
    request: CreatePostContract.request,
  ): Promise<CreatePostContract.response> {
    const { payload: post, ...reqMessage } = request;
    this.logger.log({ createPost: post });
    try {
      const createdPost = await this.postFacade.commands.createPost(post);
      return {
        ...reqMessage,
        payload: createdPost,
      };
    } catch (e) {
      this.logger.error(e);
      return {
        ...reqMessage,
        payload: null,
        error: this.errorHandler(e),
      };
    }
  }

  private errorHandler(error: any) {
    return {
      code: error?.name || 'error',
      message:
        error?.message || (error && JSON.stringify(error)) || 'something error',
    };
  }
}
