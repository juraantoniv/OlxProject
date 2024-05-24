import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { TokenType } from '../../../common/enums/token.enum';
import { EUserBanned } from '../../../common/enums/users.rights.enum';
import { UserRepository } from '../../../repository/services/user.repository';
import { TokenService } from '../services/token.service';

@Injectable()
export class BannedAccessGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];
    const { email } = request.body;

    if (email) {
      const user = await this.userRepository.findOneBy({
        email,
      });
      if (user.active === EUserBanned.BANNED) {
        throw new UnauthorizedException(
          'You are banned on this platform, please contact admin',
        );
      }
    }

    if (accessToken) {
      const payload = await this.tokenService.verifyToken(
        accessToken.trim(),
        TokenType.ACCESS,
      );
      if (!payload) {
        throw new UnauthorizedException();
      }

      const user = await this.userRepository.findOneBy({
        id: payload.userId,
      });
      if (user.active === EUserBanned.BANNED) {
        throw new UnauthorizedException('You are banned on this platform');
      }
    }
    return true;
  }
}
