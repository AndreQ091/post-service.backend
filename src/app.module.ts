import { SharedModule } from '@lib/shared';
import { Module } from '@nestjs/common';
import { ProvidersModule } from 'lib/providers';

@Module({
  imports: [SharedModule, ProvidersModule],
})
export class AppModule {}
