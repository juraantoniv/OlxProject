import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { S3Service } from '../../common/services/s3.service';
import { RedisModule } from '../redis/redis.module';
import { UserService } from '../user/services/user.service';
import { AdminController } from './admin.controller';
import { AuthController } from './auth.controller';
import { JwtAccessGuard } from './guards/jwt.access.guard';
import { AuthCacheService } from './services/auth.cache.service';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { UserModule } from '../user/user.module';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { EmailService } from '../../common/services/email.service';
import { GoodsRepository } from '../goods/goods.repository';
import { GoogleStrategy } from './strategy/google.strategy';
import { SessionSerializer } from './serializer/session.serializer';
import { OAuth2Client } from 'google-auth-library';

@Module({
  controllers: [AuthController, AdminController],
  imports: [
    JwtModule,
    RedisModule,
    UserModule,
    ClientsModule.register([
      {
        name: 'USER_MICROSERVICE',
        transport: Transport.TCP,
        options: { port: 3000 },
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    AuthService,
    AuthCacheService,
    TokenService,
    S3Service,
    UserService,
    UserModule,
    RefreshTokenRepository,
    EmailService,
    GoogleStrategy,
    SessionSerializer,
    OAuth2Client,
  ],
  exports: [AuthCacheService, TokenService],
})
export class AuthModule {}
