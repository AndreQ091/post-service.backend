import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus, EventBus } from '@nestjs/cqrs';
import { CreatePostDto, UpdatePostDto } from './commands/dto';
import { CreatePostCommand } from './commands/create-post/create-post.command';
import { CreatePostCommandHandler } from './commands/create-post/create-post.command-handler';
import { UpdatePostCommand } from './commands/update-post/update-post.command';
import { UpdatePostCommandHandler } from './commands/update-post/update-post.command-handler';
import { SetPublishedCommand } from './commands/set-published/set-published.command';
import { SetPublishedCommandHandler } from './commands/set-published/set-published.command-handler';
import { DeletePostCommand } from './commands/delete-post/delete-post.command';
import { DeletePostCommandHandler } from './commands/delete-post/delete-post.command-handler';
import { GetPostQuery } from './queries/get-post/get-post.query';
import { GetPostQueryHandler } from './queries/get-post/get-post.query-handler';
import { PaginationDto } from '@lib/shared/dto';
import { GetPostsQuery } from './queries/get-posts/get-posts.query';
import { GetPostsQueryHandler } from './queries/get-posts/get-posts.query-handler';

@Injectable()
export class PostFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  commands = {
    createPost: (post: CreatePostDto) => this.createPost(post),
    updatePost: (post: UpdatePostDto) => this.updatePost(post),
    setPublishedPost: (id: string) => this.setPublishedPost(id),
    deletePost: (id: string) => this.deletePost(id),
  };
  queries = {
    getPost: (id: string) => this.getPost(id),
    getPosts: (pagination: PaginationDto) => this.getPosts(pagination),
  };
  events = {};

  private createPost(post: CreatePostDto) {
    return this.commandBus.execute<
      CreatePostCommand,
      CreatePostCommandHandler['execute']
    >(new CreatePostCommand(post));
  }

  private updatePost(post: UpdatePostDto) {
    return this.commandBus.execute<
      UpdatePostCommand,
      UpdatePostCommandHandler['execute']
    >(new UpdatePostCommand(post));
  }

  private setPublishedPost(id: string) {
    return this.commandBus.execute<
      SetPublishedCommand,
      SetPublishedCommandHandler['execute']
    >(new SetPublishedCommand(id));
  }

  private deletePost(id: string) {
    return this.commandBus.execute<
      DeletePostCommand,
      DeletePostCommandHandler['execute']
    >(new DeletePostCommand(id));
  }

  private getPost(id: string) {
    return this.queryBus.execute<GetPostQuery, GetPostQueryHandler['execute']>(
      new GetPostQuery(id),
    );
  }

  private getPosts(pagination: PaginationDto) {
    return this.queryBus.execute<
      GetPostsQuery,
      GetPostsQueryHandler['execute']
    >(new GetPostsQuery(pagination));
  }
}
