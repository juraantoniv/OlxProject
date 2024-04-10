import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Binary } from 'typeorm';

import { ECars } from '../../../../common/enums/cars.enum';
import { EUserBanned } from '../../../../common/enums/users.rights.enum';
import { ApiFile } from '../../decorators/api-file.decorator';

export class CreateCarDto {
  @IsString()
  @Length(2, 20)
  @Transform(({ value }) => value.trim())
  model: string;

  @IsString()
  @Length(2, 20)
  // @ApiProperty({ name: 'brand', enum: ECars })
  // @IsEnum(ECars)
  @Transform(({ value }) => value.trim())
  brand: string;

  @IsString()
  currency_type: string;

  @IsString()
  price: string;

  @IsString()
  description: string;
}
