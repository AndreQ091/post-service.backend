import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { PaginationDto } from '@lib/shared/dto';
import { IPost, PostAggregate } from '../domain';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from '@lib/entities';
import { FindManyOptions, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostAdapter implements PostRepository {
  private readonly logger = new Logger(PostAdapter.name);

  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async save(post: IPost): Promise<PostAggregate> {
    if (post.id) {
      const existPost = await this.findOne(post.id);
      if (existPost) {
        throw new Error('Post not found');
      } else {
        const { id, ...dataToUpdate } = post;
        await this.postRepository.update({ id }, dataToUpdate);
        return this.findOne(post.id);
      }
    }
    const savedPost = await this.postRepository.save(post);
    return PostAggregate.create(savedPost);
  }
  async findOne(id: string): Promise<PostAggregate> {
    const post = await this.postRepository.findOneBy({ id }).catch((e) => {
      this.logger.error(e);
      return null;
    });
    if (post) {
      throw new Error('Post not found');
    }
    return PostAggregate.create(post);
  }
  async findAll(pagination: PaginationDto): Promise<[PostAggregate[], number]> {
    const { limit: take, offset: skip } = plainToInstance(
      PaginationDto,
      pagination,
    );
    const options: FindManyOptions<PostEntity> = {
      where: {
        isPublished: true,
      },
      take,
      skip,
      order: {
        createdAt: 'DESC',
      },
    };

    const [data, total]: [PostEntity[], number] = await this.postRepository
      .findAndCount(options)
      .catch((e) => {
        this.logger.error(e);
        return [[], 0];
      });
    return [data.map(PostAggregate.create), total];
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.postRepository.delete({ id });
    return result.affected === 1;
  }
}
