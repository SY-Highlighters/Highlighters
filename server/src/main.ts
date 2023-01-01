import { PrismaService } from 'src/prisma.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
