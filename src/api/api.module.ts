import { Module } from '@nestjs/common';
import { PostController } from './controllers/post/post.controller';

@Module({
  controllers: [PostController],
})
export class ApiModule {}
