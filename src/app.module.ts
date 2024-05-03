import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { PostgresModule } from './modules/postgress/postgres.module';
import { EmailService } from './common/services/email.service';
import { CustomEmailModule } from './modules/email/email-module';
import { TasksService } from './common/crons/cron.runner';
import { CustomConfigModule } from './common/config/config.module';
import { GoodsModule } from './modules/goods/goods.module';
import { RepositoryModule } from './repository/repository.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    CustomEmailModule,
    PostgresModule,
    GoodsModule,
    RedisModule,
    RepositoryModule,
    AuthModule,
    CustomConfigModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [AppService, TasksService, EmailService],
})
export class AppModule {}
