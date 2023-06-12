import { Module } from '@nestjs/common';
import { ControllersModule } from './controllers';
import { AuthModule } from '@lib/auth';
import { ResolversModule } from './resolvers/resolvers.module';

@Module({
  imports: [ControllersModule, AuthModule, ResolversModule],
})
export class ApiModule {}
