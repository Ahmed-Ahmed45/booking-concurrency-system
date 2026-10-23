import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Booking Concurrency System API')
    .setDescription('API documentation for slots and high-concurrency booking operations')
    .setVersion('1.0')
    .addTag('Slots', 'Slot management and availability')
    .addTag('Booking', 'Booking operations and reservation status')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Booking Concurrency System API',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
