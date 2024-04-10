import { UserEntity } from '../../../database/entities/user.entity';
import { UserMapper } from '../../user/services/user.mapper';
import {
  AuthUserResponseDto,
  AuthUserResponseTokensDto,
} from '../dto/response/auth-user.response.dto';
import { TokenResponseDto } from '../dto/response/token.responce.dto';

export class AuthMapper {
  public static toResponseDto(
    userEntity: Partial<UserEntity>,
  ): AuthUserResponseDto {
    return {
      user: UserMapper.toResponseDto(userEntity),
    };
  }
}

export class AuthMapperWithTokens {
  public static toResponseDto(
    userEntity: Partial<UserEntity>,
    tokens: TokenResponseDto,
  ): AuthUserResponseTokensDto {
    return {
      tokens: tokens,
      user: UserMapper.toResponseDto(userEntity),
    };
  }
}
