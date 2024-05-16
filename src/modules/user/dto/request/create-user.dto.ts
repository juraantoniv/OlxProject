import { Transform, Type } from 'class-transformer';
import {
  IS_UUID,
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 20)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsPhoneNumber('UA')
  phone: any;

  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;

  @IsInt()
  @Min(16)
  @Max(99)
  @Type(() => Number)
  age: number;

  @IsString()
  @Length(2, 20)
  @Transform(({ value }) => value.trim())
  city: string;
}

export class SendMessageDto {
  @IsString()
  message: string;
}

export class SendHelpMessageDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  subject: string;

  @IsString()
  message: string;
}
