import getConfigs from '../../../configs/configs';
import { UserEntity } from '../../../database/entities/user.entity';
import * as dotenv from 'dotenv';
dotenv.config({ path: './environments/local.env' });

const awsConfig = getConfigs().aws;
export class UserMapper {
  public static toResponseDto(user: Partial<UserEntity>): Partial<UserEntity> {
    return {
      email: user.email,
      name: user.name,
      avatar: `${awsConfig.aws_url}${user.avatar}`,
      age: user.age,
      city: user.city,
      role: user.role,
    };
  }
}
