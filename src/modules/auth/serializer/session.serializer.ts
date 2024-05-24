import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserEntity } from '../../../database/entities/user.entity';
import { UserRepository } from '../../../repository/services/user.repository';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  serializeUser(user: UserEntity, done: any) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: any) {
    const user = await this.userRepository.findOneBy({
      id: payload.id,
    });
    return user ? done(null, user) : done(null, null);
  }
}
