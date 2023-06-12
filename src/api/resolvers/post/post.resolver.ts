import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostResponse, PaginatedPosts } from './responses';
import { PostFacade } from '@lib/post/application-services';
import { PaginationDto } from '@lib/shared/dto';
import { plainToInstance } from 'class-transformer';
import { CreatePostInput, UpdatePostInput } from './inputs';
import { GqlCurrentUser, ICurrentUser, Public } from '@lib/auth';
import { UseGuards } from '@nestjs/common';
import { GqlGuard } from '@lib/auth/guards/gql.guard';

@UseGuards(GqlGuard)
@Resolver(() => PostResponse)
export class PostResolver {
  constructor(private readonly postFacade: PostFacade) {}

  @Public()
  @Query(() => PostResponse, { name: 'getPostById' })
  async getPostById(@Args('id') id: string) {
    return this.postFacade.queries.getPost(id);
  }

  @Public()
  @Query(() => PaginatedPosts, { name: 'getPostsList' })
  async getPostsList(@Args() paginationDto: PaginationDto) {
    const pagination = plainToInstance(PaginationDto, paginationDto);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [data, total] = await this.postFacade.queries.getPosts(pagination);
    return {
      ...pagination,
      data,
      total,
    };
  }

  @Mutation(() => PostResponse, { name: 'createPost' })
  async createPost(
    @GqlCurrentUser() currentUser: ICurrentUser,
    @Args('createPostInput') createPostInput: CreatePostInput,
  ) {
    return this.postFacade.commands.createPost({
      ...createPostInput,
      authorId: currentUser.id,
    });
  }

  @Mutation(() => PostResponse, { name: 'updatePost' })
  async updatePost(
    @GqlCurrentUser() currentUser: ICurrentUser,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ) {
    return this.postFacade.commands.updatePost({
      ...updatePostInput,
      authorId: currentUser.id,
    });
  }

  @Mutation(() => PostResponse, { name: 'setPublishedPost' })
  async setPublishedPost(@Args('id') id: string) {
    return this.postFacade.commands.setPublishedPost(id);
  }

  @Mutation(() => Boolean, { name: 'deletePost' })
  async deletePost(@Args('id') id: string) {
    return this.postFacade.commands.deletePost(id);
  }
}
