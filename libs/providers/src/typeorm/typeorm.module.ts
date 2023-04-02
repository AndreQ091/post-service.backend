import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appDataSourse } from './typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(appDataSourse.options)],
})
export class TypeormModule {}
