import { PostFacade } from '@lib/post/application-services';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto';
import { CurrentUser, ICurrentUser, Public } from '@lib/auth';
import { JwtGuard } from '@lib/auth/guards/jwt.guard';
import { PaginationDto } from '@lib/shared/dto';
import { plainToInstance } from 'class-transformer';
import { ResponseWithPagination } from '@lib/shared';
import { PostAggregate } from '@lib/post';

@UseGuards(JwtGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postFacade: PostFacade) {}

  @Post()
  async createPost(
    @CurrentUser() user: ICurrentUser,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postFacade.commands.createPost({
      ...createPostDto,
      authorId: user.id,
    });
  }

  @Public()
  @Get(':id')
  async getPostById(@Param('id', ParseUUIDPipe) id: string) {
    return this.postFacade.queries.getPost(id);
  }

  @Public()
  @Get()
  async getPosts(
    @Query() paginationDto: PaginationDto,
  ): Promise<ResponseWithPagination<PostAggregate>> {
    const pagination = plainToInstance(PaginationDto, paginationDto);
    const [data, count] = await this.postFacade.queries.getPosts(pagination);
    return {
      ...pagination,
      data,
      total: count,
    };
  }

  @Put()
  async updatePost(
    @CurrentUser() user: ICurrentUser,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postFacade.commands.updatePost({
      ...updatePostDto,
      authorId: user.id,
    });
  }

  @Patch(':id')
  async setPublished(@Param('id', ParseUUIDPipe) id: string) {
    return this.postFacade.commands.setPublishedPost(id);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseUUIDPipe) id: string) {
    return this.postFacade.commands.deletePost(id);
  }
}
