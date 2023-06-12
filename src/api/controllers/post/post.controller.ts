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
import { ApiOkResponsePaginated, ResponseWithPagination } from '@lib/shared';
import { PostAggregate } from '@lib/post';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostResponse } from './response';

@ApiTags('posts')
@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postFacade: PostFacade) {}

  @ApiOperation({
    summary: 'Create post',
  })
  @ApiBearerAuth()
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

  @ApiOkResponsePaginated(PostResponse)
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

  @ApiOperation({
    summary: 'Update post',
  })
  @ApiBearerAuth()
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

  @ApiOperation({
    summary: 'Set isPublished post',
  })
  @ApiBearerAuth()
  @Patch(':id')
  async setPublished(@Param('id', ParseUUIDPipe) id: string) {
    return this.postFacade.commands.setPublishedPost(id);
  }

  @ApiOperation({
    summary: 'Delete post',
  })
  @ApiBearerAuth()
  @Delete(':id')
  async deletePost(@Param('id', ParseUUIDPipe) id: string) {
    return this.postFacade.commands.deletePost(id);
  }
}
