import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(port);
}
bootstrap();
