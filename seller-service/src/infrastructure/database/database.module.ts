import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SellerTypeOrmEntity } from './typeorm/entities/seller.entity';
import { SellerRepository } from './typeorm/repositories/seller.repository';

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
    TypeOrmModule.forFeature([SellerTypeOrmEntity]),
  ],
  providers: [
    {
      provide: SellerRepository,
      useFactory: (repository) => new SellerRepository(repository),
      inject: [getRepositoryToken(SellerTypeOrmEntity)],
    },
  ],
  exports: [SellerRepository, TypeOrmModule],
})
export class DatabaseModule {}
