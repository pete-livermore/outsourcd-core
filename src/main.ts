import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, PartialGraphHost, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { ParseSnakeCasePipe } from './common/pipes/parse-snake-case.pipe';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { notificationsConfig } from './notifications/microservice.provider';
import { CamelCaseToSnakeCaseInterceptor } from './common/interceptors/camel-to-snake.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
  });

  // connect notifications microservice
  app.connectMicroservice<MicroserviceOptions>(notificationsConfig);

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api', {
    exclude: ['auth/:splat*'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ParseSnakeCasePipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new CamelCaseToSnakeCaseInterceptor(),
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle(configService.get('OPEN_API_TITLE'))
    .setDescription(configService.get('OPEN_API_DESCRIPTION'))
    .setVersion(String(configService.get('API_VERSION')))
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.startAllMicroservices();
  await app.listen(configService.get('APP_PORT'));
}
bootstrap().catch(() => {
  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
  process.exit(1);
});
