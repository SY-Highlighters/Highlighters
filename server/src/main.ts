import * as dotenv from 'dotenv';
dotenv.config();
// import apm from 'elastic-apm-node/start';
import { PrismaService } from 'src/repository/prisma.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import * as expressBasicAuth from 'express-basic-auth';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new WsAdapter(app));

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(
    ['/api_docs', '/api_docs/*'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJS Prisma')
    .setDescription('NestJS Prisma API description')
    .setVersion('1.0')
    .addTag('NestJS Prisma')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api_docs', app, document);

  // const port = process.env.NODE_SERVER_PORT;

  await app.listen(3001);
}
bootstrap();
