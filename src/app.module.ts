import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import {getRootPath} from './util/util.paths'
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath:`${getRootPath()}/config/default.env`,
      isGlobal:true
    })
  ],
})
export class AppModule {}
