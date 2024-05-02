import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

import { CreateUserDto } from './create-user.dto';
import { EUserBanned } from '../../../../common/enums/users.rights.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @Length(2, 20)
  @Transform(({ value }) => value.trim())
  name: string;
  @IsString()
  @Transform(({ value }) => value.trim())
  city: string;

  @IsInt()
  @Min(16)
  @Max(99)
  age: number;

  @IsEnum(EUserBanned)
  active: EUserBanned;
}
