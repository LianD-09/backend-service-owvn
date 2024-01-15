import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  const logger = new Logger('StarApplication');

  app.enableCors();
  await app.listen(process.env.PORT, () => {
    logger.log(
      `🚀 🙄😳🙄 Restfull API Service start at http://localhost:${process.env.PORT}/`,
    );
  });
}
bootstrap();