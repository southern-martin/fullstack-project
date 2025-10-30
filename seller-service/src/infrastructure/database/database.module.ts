import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SellerTypeOrmEntity } from './typeorm/entities/seller.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [SellerTypeOrmEntity],
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
        migrationsRun: configService.get('DB_MIGRATIONS_RUN') === 'true',
        migrations: ['dist/infrastructure/database/typeorm/migrations/**/*.js'],
        logging: configService.get('DB_LOGGING') === 'true',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
