import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from '@nestjs/common'
import {getRootPath} from './util/util.paths'
const TAG = 'main'
const PORT = 3000

getRootPath()
// console.log(TAG,'::serverConfig:',serverConfig)
async function bootstrap() {
  const logger = new Logger(`${TAG}::bootstrap`)
  const app = await NestFactory.create(AppModule);
  if(process.env.NODE_ENV === 'development'){
    app.enableCors()
  }
  await app.listen(PORT);
  logger.log(`Aplicação escutando a porta123 ${PORT}`)

}
bootstrap();
