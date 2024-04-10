import { Exclude } from 'class-transformer';

import { UserEntity } from '../../../../database/entities/user.entity';
import { TokenResponseDto } from './token.responce.dto';

// import { TokenResponseDto } from './token.response.dto';

@Exclude()
export class AuthUserResponseDto {
  // tokens: TokenResponseDto;
  user: Partial<UserEntity>;
}

export class AuthUserResponseTokensDto {
  tokens: TokenResponseDto;
  user: any;
}
