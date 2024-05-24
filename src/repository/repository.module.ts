import { Global, Module } from '@nestjs/common';

import { UserModule } from '../modules/user/user.module';
import { UserRepository } from './services/user.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { LikeRepository } from './services/like.repository';
import { ViewsRepository } from './services/views.repository';
import { GoodsModule } from '../modules/goods/goods.module';
import { MessageRepository } from './services/message.repository';

const repositories = [
  LikeRepository,
  RefreshTokenRepository,
  ViewsRepository,
  MessageRepository,
  UserRepository,
];

@Global()
@Module({
  imports: [UserModule, GoodsModule],
  controllers: [],
  providers: [...repositories],
  exports: [...repositories, UserModule, GoodsModule],
})
export class RepositoryModule {}
