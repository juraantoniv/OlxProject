import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';

import { EUserBanned } from '../../../common/enums/users.rights.enum';
import { EFileTypes, S3Service } from '../../../common/services/s3.service';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { UserRepository } from '../user.repository';
import { UserMapper } from './user.mapper';
import { GoodsRepository } from '../../goods/goods.repository';
import { MessageRepository } from '../../../repository/services/message.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly goodsRepository: GoodsRepository,
    private readonly messageRepository: MessageRepository,
    private readonly s3Serv: S3Service,
  ) {}

  public async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
    this.logger.log('Creating user with DTO:', createUserDto);
    const newUser = this.userRepository.create(createUserDto);

    const user = await this.userRepository.save(newUser);
    const filePath = await this.s3Serv.uploadFile(
      file,
      EFileTypes.User,
      user.id,
    );
    newUser.avatar = filePath;
    await this.userRepository.save(user);
    return newUser;
  }

  public async findAll() {
    return await this.userRepository.find();
  }

  public async findOne(id: string) {
    return await this.findUserByIdOrException(id);
  }

  public async update(updateUserDto: UpdateUserDto, userData: IUserData) {
    const entity = await this.findUserByIdOrException(userData.userId);
    this.userRepository.merge(entity, updateUserDto);
    return await this.userRepository.save(entity);
  }
  public async updateByAdmin(id: string, updateUserDto: UpdateUserDto) {
    const entity = await this.findUserByIdOrException(id);
    this.userRepository.merge(entity, updateUserDto);
    return await this.userRepository.save(entity);
  }
  public async banUser(id: string) {
    const entity = await this.findUserByIdOrException(id);
    this.userRepository.merge(entity, {
      ...entity,
      active: EUserBanned.BANNED,
    });
    return await this.userRepository.save(entity);
  }

  public async me(userData: IUserData) {
    return UserMapper.toResponseDto(
      await this.findUserByIdOrException(userData.userId),
    );
  }

  public async remove(id: string) {
    const entity = await this.userRepository.findOneBy({ id });
    if (!entity) {
      throw new UnprocessableEntityException('User not found');
    }

    await this.userRepository.remove(entity);
  }
  private async findUserByIdOrException(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnprocessableEntityException('User entity not found');
    }
    return user;
  }

  public async sendMessage(message: string, id: string, userData: IUserData) {
    const user = await this.findUserByIdOrException(userData.userId);
    const good = await this.goodsRepository.findOne({
      where: {
        id,
      },
    });
    await this.messageRepository.save(
      this.messageRepository.create({
        message: message,
        good_id: good.id,
        user_id: good.user_id,
        users_id_massages: user.id,
      }),
    );
  }
}
