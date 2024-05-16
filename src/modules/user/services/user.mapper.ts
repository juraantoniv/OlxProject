import getConfigs from '../../../common/configs/configs';
import { UserEntity } from '../../../database/entities/user.entity';
import * as dotenv from 'dotenv';
import { PartialType } from '@nestjs/swagger';
import { CreateGoodDto } from '../../goods/dto/request/create-good.dto';
dotenv.config({ path: './environments/local.env' });

export class UserResponseDto extends PartialType(UserEntity) {}

const awsConfig = getConfigs().aws;
export class UserMapper {
  public static toResponseDto(user: Partial<UserEntity>): UserResponseDto {
    return {
      id: user.id,
      phone: user.phone,
      email: user.email,
      name: user.name,
      created: user.created,
      avatar: `${awsConfig.aws_url}${user.avatar}`,
      age: user.age,
      city: user.city,
      role: user.role,
      active: user.active,
      messages: user.messages,
      sendedMessages: user.sendedMessages,
    };
  }
}
