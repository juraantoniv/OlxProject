import { TokenResponseDto } from './token.responce.dto';
import { UserResponseDto } from '../../../user/services/user.mapper';

export class AuthUserResponseDto {
  user: UserResponseDto;
}

export class AuthUserResponseTokensDto {
  tokens: TokenResponseDto;
  user: UserResponseDto;
}
