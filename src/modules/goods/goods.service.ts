import { ForbiddenException, Injectable } from '@nestjs/common';
import axios from 'axios';

import { EEmailAction } from '../../common/enums/email.action.enum';
import { ERights, EType } from '../../common/enums/users.rights.enum';
import { EmailService } from '../../common/services/email.service';
import { EFileTypes, S3Service } from '../../common/services/s3.service';
import { UserEntity } from '../../database/entities/user.entity';
import { LikeRepository } from '../../repository/services/like.repository';
import { ViewsRepository } from '../../repository/services/views.repository';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { UserRepository } from '../user/user.repository';
import { GoodsRepository } from './goods.repository';
import { CarsListRequestDto } from './dto/request/cars-list-request.dto';
import { CreateCarDto } from './dto/request/create-car.dto';
import { UpdateCarDto } from './dto/request/update-car.dto';
import { CarsResponseMapper } from './services/goods.responce.mapper';
import { GoodsEntity } from '../../database/entities/goods.entity';

@Injectable()
export class GoodsService {
  constructor(
    private readonly goodsRepository: GoodsRepository,
    private readonly userRepository: UserRepository,
    private readonly s3Serv: S3Service,
    private readonly emailService: EmailService,
    private readonly viewsRepository: ViewsRepository,
    private readonly likeRepository: LikeRepository,
  ) {}
  async create(
    createCarDto: CreateCarDto,
    file: Express.Multer.File,
    userData: IUserData,
  ) {
    const course = await axios.get(
      'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
    );

    const currentUser = await this.userRepository.findOneBy({
      id: userData.userId,
    });

    // if (!createCarDto.brand.includes('[BMW, MERCEDES, OPEL]')) {
    //   const user = await this.userRepository.find({
    //     where: {
    //       role: ERights.Admin,
    //     },
    //   });
    //   user.map(async (user) => {
    //     await this.emailService.send(user.email, EEmailAction.Card_Brand, {
    //       name: currentUser.name,
    //       email: currentUser.email,
    //       model: createCarDto.brand,
    //     });
    //   });
    // }
    const filePath = await this.s3Serv.uploadFile(
      file,
      EFileTypes.User,
      userData.userId,
    );

    const user = this.goodsRepository.create({
      ...createCarDto,
      image: filePath,
      user_id: userData.userId,
    });
    return await this.goodsRepository.save(user);
  }

  public async findAll(query: CarsListRequestDto, userData: IUserData) {
    const user = await this.userRepository.findOneBy({ id: userData.userId });

    const userPremium = user.userPremiumRights;
    try {
      const [entities, total] = await this.goodsRepository.getList(
        query,
        userData,
      );
      return userPremium === EType.Premium
        ? CarsResponseMapper.PremResponseManyDto(entities, total, query)
        : CarsResponseMapper.toResponseManyDto(entities, total, query);
    } catch (e) {
      console.log(e);
    }
  }

  public async findOne(id: string, userData: IUserData) {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const userPremium = user.userPremiumRights;
    const car = await this.goodsRepository.getById(id);
    await this.viewsRepository.save({
      car_id: car.id,
      user_id: userData.userId,
    });
    console.log(car);
    return userPremium === EType.Premium
      ? CarsResponseMapper.toResponseDtoViews(car)
      : CarsResponseMapper.toResponseDto(car);
  }

  public async update(
    id: string,
    updateCarDto: UpdateCarDto,
    userData: IUserData,
  ) {
    const car = await this.goodsRepository.findOneBy({ id: id });
    if (car.user_id !== userData.userId) {
      throw new ForbiddenException('You cant edit a car that not your own');
    }

    return await this.goodsRepository.save({
      ...car,
      check_of_valid: car.check_of_valid + 1,
      ...updateCarDto,
    });
  }

  public async remove(id: string, userData: IUserData) {
    const { good, user } = await this.findCarAndUser(id, userData.userId);

    if (good.user_id !== userData.userId && user.role !== ERights.Admin) {
      throw new ForbiddenException('You cant delete a car that not your own');
    }

    try {
      await this.s3Serv.deleteFile(good.image);
      await this.goodsRepository.remove(good);
    } catch (e) {
      console.log(e);
    }
  }
  public async like(id: string, userData: IUserData) {
    const { good, user } = await this.findCarAndUser(id, userData.userId);

    if (good.user_id === userData.userId) {
      throw new ForbiddenException('You cant like a car that  your own car');
    }

    await this.likeRepository.save(
      this.likeRepository.create({ good_id: id, user_id: userData.userId }),
    );
  }
  public async dislike(id: string, userData: IUserData) {
    const { good, user } = await this.findCarAndUser(id, userData.userId);
    if (good.user_id === userData.userId) {
      throw new ForbiddenException('You cant dislike a car that  your own car');
    }

    const likeEntity = await this.likeRepository.findOneBy({
      good_id: id,
      user_id: userData.userId,
    });

    if (!likeEntity) {
      throw new ForbiddenException();
    }

    await this.likeRepository.remove(likeEntity);
  }
  public async buyCar(id: string, userData: IUserData) {
    const { good, user } = await this.findCarAndUser(id, userData.userId);

    const users = await this.userRepository.findBy({
      role: ERights.Manager,
    });

    users.map(async (el) => {
      await this.emailService.send(el.email, EEmailAction.Buy, {
        name: user.name,
        email: user.email,
        city: user.city,
        brand: good.title,
      });
    });
  }
  private async findCarAndUser(
    carId: string,
    userId: string,
  ): Promise<{ good: GoodsEntity; user: UserEntity }> {
    const good = await this.goodsRepository.findOneBy({ id: carId });
    const user = await this.userRepository.findOneBy({ id: userId });
    return {
      good,
      user,
    };
  }

  public async addToFavorite(id: string, userData: IUserData) {
    const { good, user } = await this.findCarAndUser(id, userData.userId);

    if (good.favorite.includes(userData.userId)) {
      throw new ForbiddenException('You cant add to favorite twice ');
    }

    if (good.user_id === userData.userId) {
      throw new ForbiddenException('You cant add a car that  your own car');
    }

    await this.goodsRepository.save(
      this.goodsRepository.create({
        ...good,
        favorite: [...good.favorite, userData.userId],
      }),
    );
  }

  public async removeFavorite(id: string, userData: IUserData) {
    const { good, user } = await this.findCarAndUser(id, userData.userId);
    if (!good.favorite.includes(userData.userId)) {
      throw new ForbiddenException('You cant remove to favorite  ');
    }

    if (good.user_id === userData.userId) {
      throw new ForbiddenException('You cant add a car that  your own car');
    }

    await this.goodsRepository.save(
      this.goodsRepository.create({
        ...good,
        favorite: [...good.favorite.filter((el) => el !== userData.userId)],
      }),
    );
  }

  public async favoriteGoods(userId: string) {
    return await this.goodsRepository
      .createQueryBuilder('goods')
      .where('goods.favorite @> ARRAY[:userId]')
      .setParameter('userId', userId)
      .getMany();
  }
}
