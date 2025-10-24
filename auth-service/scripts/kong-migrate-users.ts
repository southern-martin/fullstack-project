#!/usr/bin/env ts-node

/**
 * Kong Consumer Migration Script
 * Syncs all existing users from the database to Kong consumers
 * 
 * Usage: npm run kong:migrate
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { KongService } from '../src/infrastructure/external-services/kong.service';
import { UserRepositoryInterface } from '../src/domain/repositories/user.repository.interface';

async function migrateUsersToKong() {
  console.log('🚀 Kong Consumer Migration Script');
  console.log('====================================\n');

  // Bootstrap NestJS application
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Get services
    const kongService = app.get(KongService);
    const userRepository = app.get<UserRepositoryInterface>('UserRepositoryInterface');

    // Check Kong health
    console.log('⏳ Checking Kong Gateway connection...');
    const isHealthy = await kongService.healthCheck();
    if (!isHealthy) {
      console.error('❌ Kong Gateway is not accessible. Please ensure Kong is running.');
      console.error('   KONG_ADMIN_URL:', process.env.KONG_ADMIN_URL || 'http://localhost:8001');
      process.exit(1);
    }
    console.log('✅ Kong Gateway is accessible\n');

    // Get all users
    console.log('📊 Fetching users from database...');
    const result = await userRepository.findAll();
    const users = result.users;
    console.log(`Found ${users.length} users\n`);

    if (users.length === 0) {
      console.log('No users to migrate. Exiting.');
      await app.close();
      return;
    }

    // Migrate each user
    console.log('🔄 Starting migration...\n');
    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      try {
        console.log(`Processing: ${user.email} (ID: ${user.id})`);
        
        await kongService.createKongConsumer(
          user.id!,
          user.email,
          user.roles || []
        );
        
        console.log(`✅ Success: ${user.email}`);
        console.log(`   Roles: ${(user.roles || []).map(r => r.name).join(', ')}\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed: ${user.email}`);
        console.error(`   Error: ${error instanceof Error ? error.message : String(error)}\n`);
        failCount++;
      }
    }

    // Summary
    console.log('\n====================================');
    console.log('📈 Migration Summary');
    console.log('====================================');
    console.log(`Total users:     ${users.length}`);
    console.log(`✅ Successful:   ${successCount}`);
    console.log(`❌ Failed:       ${failCount}`);
    console.log('====================================\n');

    if (failCount > 0) {
      console.log('⚠️  Some users failed to migrate. Please check the errors above.');
      process.exit(1);
    } else {
      console.log('🎉 All users successfully migrated to Kong!');
    }

  } catch (error) {
    console.error('\n❌ Migration failed with error:');
    console.error(error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

// Run migration
migrateUsersToKong();
