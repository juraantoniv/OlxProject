import { Module } from '@nestjs/common';

import { EmailService } from '../../common/services/email.service';
import { S3Service } from '../../common/services/s3.service';
import { LikeRepository } from '../../repository/services/like.repository';
import { ViewsRepository } from '../../repository/services/views.repository';
import { AuthModule } from '../auth/auth.module';
import { GoodsController } from './goods.controller';
import { GoodsRepository } from './goods.repository';
import { GoodsService } from './goods.service';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [AuthModule],
  controllers: [GoodsController],
  providers: [
    GoodsService,
    GoodsRepository,
    UserRepository,
    LikeRepository,
    S3Service,
    EmailService,
    ViewsRepository,
  ],
  exports: [GoodsRepository],
})
export class GoodsModule {}
