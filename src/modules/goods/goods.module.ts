import { Module } from '@nestjs/common';

import { EmailService } from '../../common/services/email.service';
import { S3Service } from '../../common/services/s3.service';
import { LikeRepository } from '../../repository/services/like.repository';
import { ViewsRepository } from '../../repository/services/views.repository';
import { AuthModule } from '../auth/auth.module';
import { CarsController } from './cars.controller';
import { CarsRepository } from './cars.repository';
import { CarsService } from './cars.service';

@Module({
  imports: [AuthModule],
  controllers: [CarsController],
  providers: [
    CarsService,
    CarsRepository,
    LikeRepository,
    S3Service,
    EmailService,
    ViewsRepository,
  ],
  exports: [CarsRepository, EmailService],
})
export class CarsModule {}
