import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { log } from 'console';

import { TokenType } from '../../../common/enums/token.enum';
import { RefreshTokenRepository } from '../../../repository/services/refresh-token.repository';
import { UserRepository } from '../../../repository/services/user.repository';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private refreshRepository: RefreshTokenRepository,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { refresh_token } = request.body;

    if (!refresh_token) {
      throw new UnauthorizedException();
    }
    const payload = await this.tokenService.verifyToken(
      refresh_token,
      TokenType.REFRESH,
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    const isExist = await this.refreshRepository.isTokenExist(refresh_token);
    if (!isExist) {
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
  }
}
