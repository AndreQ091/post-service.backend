import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

const options = (): DataSourceOptions => {
  const url = configService.get('DATABASE_URL');
  if (!url) {
    throw new Error('Databse url is empty');
  }
  return {
    type: 'postgres',
    url,
    schema: 'public',
    logging: configService.get('NODE_ENV') === 'development',
    entities: [],
    migrations: [join(process.cwd(), 'migrations', '**', '*.migration.ts')],
    migrationsRun: true,
    migrationsTableName: 'migrations',
  };
};
export const appDataSourse = new DataSource(options());
