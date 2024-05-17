import {
  ForbiddenException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';

import { ERights, EUserBanned } from '../../../common/enums/users.rights.enum';
import { EFileTypes, S3Service } from '../../../common/services/s3.service';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { UserRepository } from '../user.repository';
import { UserMapper } from './user.mapper';
import { GoodsRepository } from '../../goods/goods.repository';
import { MessageRepository } from '../../../repository/services/message.repository';
import { MessageEntity } from '../../../database/entities/message.entity';
import { EmailService } from '../../../common/services/email.service';
import { EEmailAction } from '../../../common/enums/email.action.enum';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly goodsRepository: GoodsRepository,
    private readonly messageRepository: MessageRepository,
    private readonly s3Serv: S3Service,
    private readonly emailService: EmailService,
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
    return UserMapper.toResponseDto(await this.findUserByIdOrException(id));
  }

  public async update(updateUserDto: UpdateUserDto, userData: IUserData) {
    const entity = await this.findUserByIdOrException(userData.userId);
    return await this.userRepository.save({ ...entity, ...updateUserDto });
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
    if (entity.role === ERights.Admin) {
      throw new ForbiddenException("You don't have rights");
    }
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

    if (id === userData.userId) {
      throw new UnprocessableEntityException('You can send message yourself');
    }
    await this.messageRepository.save(
      this.messageRepository.create({
        message: message,
        user_id: id,
        users_id_massages: user.id,
      }),
    );
  }

  public async help(userData: IUserData, message: string, subject: string) {
    const customer = await this.findUserByIdOrException(userData.userId);

    const admins = await this.userRepository.find({
      where: {
        role: ERights.Admin,
      },
    });

    admins.map(async (user) => {
      await this.emailService.send(user.email, EEmailAction.HELP, {
        email: customer.email,
        message,
        subject,
      });
    });
    return 'Message was send';
  }
  public async myMessages(
    userData: IUserData,
  ): Promise<{ receiverId: string; messages: MessageEntity[] }[]> {
    return await this.messageRepository.messagesUser(userData.userId);
  }
}
