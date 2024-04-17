import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, PartialGraphHost, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { AppModule } from './app/app.module';
import { SnakeCaseToCamelCasePipe } from './app/common/pipes/snake-to-camel.pipe';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
  });

  await app.startAllMicroservices();

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api', {
    exclude: ['auth/:splat*'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new SnakeCaseToCamelCasePipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle(configService.get('OPEN_API_TITLE'))
    .setDescription(configService.get('OPEN_API_DESCRIPTION'))
    .setVersion(String(configService.get('API_VERSION')))
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('APP_PORT'));
}
bootstrap().catch(() => {
  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
  process.exit(1);
});
