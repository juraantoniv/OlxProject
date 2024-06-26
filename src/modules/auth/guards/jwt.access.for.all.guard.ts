import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TokenType } from '../../../common/enums/token.enum';
import { UserRepository } from '../../../repository/services/user.repository';
import { SKIP_AUTH } from '../costants/costants';
import { AuthCacheService } from '../services/auth.cache.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAccessGuardForAll implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private authCacheService: AuthCacheService,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];

    if (accessToken) {
      const payload = await this.tokenService.verifyToken(
        accessToken.trim(),
        TokenType.ACCESS,
      );
      if (!payload) {
        throw new UnauthorizedException();
      }
      const findTokenInRedis = await this.authCacheService.isAccessTokenExist(
        payload.userId,
        payload.deviceId,
        accessToken,
      );
      if (!findTokenInRedis) {
        throw new UnauthorizedException();
      }

      const user = await this.userRepository.findOneBy({
        id: payload.userId,
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      request.user = {
        userId: user.id,
        email: user.email,
        deviceId: payload.deviceId,
      };

      return true;
    } else {
      return true;
    }
  }
}
