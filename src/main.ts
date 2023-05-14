import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  const config = new DocumentBuilder()
    .setTitle('Posts Microservice')
    .setDescription('The Posts Microservice API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(port, () => {
    Logger.log(`Application is running on http://localhost:${port}`, 'Main');
    Logger.log(`Swagger Doc is on http://localhost:${port}/api-doc`, 'Main');
  });
}
bootstrap();
