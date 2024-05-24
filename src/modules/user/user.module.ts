import { forwardRef, Module } from '@nestjs/common';

import { EmailService } from '../../common/services/email.service';
import { S3Service } from '../../common/services/s3.service';
import { UserController } from './user.controller';
import { UserRepository } from '../../repository/services/user.repository';
import { UserService } from './services/user.service';
import { GoodsRepository } from '../goods/goods.repository';
import { GoodsModule } from '../goods/goods.module';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, EmailService, UserRepository, S3Service],
  exports: [UserRepository],
})
export class UserModule {}
