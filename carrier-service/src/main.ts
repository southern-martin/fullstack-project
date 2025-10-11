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

  // Global prefix
  app.setGlobalPrefix("api/v1");

  const port = process.env.PORT || 3005;
  await app.listen(port);

  console.log(
    `🚀 Carrier Service is running on: http://localhost:${port}/api/v1`
  );
  console.log(`📊 Health check: http://localhost:${port}/api/v1/health`);
}

bootstrap();




