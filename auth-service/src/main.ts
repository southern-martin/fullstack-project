import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Set global prefix
  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Auth Service is running on: http://localhost:${port}`);
  console.log(
    `📚 API Documentation: http://localhost:${port}/api/v1/auth/health`
  );
}

bootstrap();





