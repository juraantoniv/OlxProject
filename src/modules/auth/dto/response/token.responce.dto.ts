import { PickType } from '@nestjs/swagger';

export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

export class AccessTokenDto extends PickType(TokenResponseDto, [
  'accessToken',
]) {}
