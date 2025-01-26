import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// 1) dotenv
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
const env = dotenv.config(); // Laden
dotenvExpand.expand(env); // Expand

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) CORS einschalten:
  app.enableCors({
    origin: '*', // oder eine bestimmte Liste z.B. ["http://localhost:3000"]
  });

  await app.listen(3004);
}
bootstrap();
