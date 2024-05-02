import { ApiProperty } from '@nestjs/swagger';

export class TokensRequestDto {
  @ApiProperty()
  refresh_token: string;
}
