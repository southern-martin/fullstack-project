import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: ['src/infrastructure/database/typeorm/entities/**/*.entity.ts'],
  migrations: ['src/infrastructure/database/typeorm/migrations/**/*.ts'],
  synchronize: false,
  logging: configService.get('DB_LOGGING') === 'true',
});
