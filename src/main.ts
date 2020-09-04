import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from '@nestjs/common'
const TAG = 'main'
const PORT = 3000
async function bootstrap() {
  const logger = new Logger(`${TAG}::bootstrap`)
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  logger.log(`Aplicação escutando a porta ${PORT}`)
}
bootstrap();
