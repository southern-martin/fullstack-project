import { Module } from '@nestjs/common';

// Controllers
import { AuthController } from './controllers/auth.controller';

// Application Module
import { ApplicationModule } from '../application/application.module';

/**
 * Interfaces Module
 * Configures interface layer dependencies
 * Follows Clean Architecture principles
 */
@Module({
  imports: [
    // Import application module which provides use cases and domain services
    ApplicationModule,
  ],
  controllers: [
    AuthController,
  ],
})
export class InterfacesModule {}
