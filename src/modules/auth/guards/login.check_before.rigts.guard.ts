import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { log } from 'console';

import { TokenType } from '../../../common/enums/token.enum';
import { RefreshTokenRepository } from '../../../repository/services/refresh-token.repository';
import { UserRepository } from '../../user/user.repository';
import { TokenService } from '../services/token.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private refreshRepository: RefreshTokenRepository,
    private userRepository: UserRepository,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let userTypeAllowed = this.reflector.get<string[]>(
      'rights',
      context.getHandler(),
    );
    const { email } = request.body;

    const user = await this.userRepository.findOneBy({ email: email });

    if (!user) {
      throw new UnauthorizedException();
    }
    if (!userTypeAllowed) {
      userTypeAllowed = this.reflector.get<string[]>(
        'rights',
        context.getClass(),
      );
      if (!userTypeAllowed) {
        return true;
      }
    }

    if (!userTypeAllowed.includes(user.role)) {
      throw new HttpException('Access denied.', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
