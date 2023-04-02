import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '@lib/post/providers';
import { DeletePostCommand } from './delete-post-command';
import { BadRequestException, Logger } from '@nestjs/common';

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler
  implements ICommandHandler<DeletePostCommand, boolean>
{
  private readonly logger = new Logger(DeletePostCommandHandler.name);
  constructor(private readonly postRepository: PostRepository) {}
  async execute({ id }: DeletePostCommand): Promise<boolean> {
    const existPost = await this.postRepository.findOne(id).catch((e) => {
      this.logger.error(e);
      return false;
    });
    if (!existPost) {
      throw new BadRequestException('Post not found');
    }
    const isDeleted = await this.postRepository.delete(id);
    return isDeleted;
  }
}
