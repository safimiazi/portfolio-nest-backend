import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow all origins
  app.enableCors({
    origin: '*',   // সব origin allow
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
