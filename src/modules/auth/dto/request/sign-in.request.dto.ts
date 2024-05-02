import { PickType } from '@nestjs/swagger';

import { AuthBaseRequestDto } from './auth-base.request.dto';
import { IsString } from 'class-validator';

export class SignInRequestDto extends PickType(AuthBaseRequestDto, [
  'deviceId',
  'email',
  'password',
]) {}

export class SingInByGoogleDto {
  @IsString()
  clientId: string;
  @IsString()
  token: string;
  @IsString()
  deviceId: string;
}
