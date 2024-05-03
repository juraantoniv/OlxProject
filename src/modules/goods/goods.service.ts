import { ForbiddenException, Injectable, Query } from '@nestjs/common';
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
import { GoodsListRequestDto } from './dto/request/goods-list-request.dto';
import { CreateGoodDto, FileUploadDto } from './dto/request/create-good.dto';
import { UpdateGoodDto } from './dto/request/update-good.dto';
import { GoodsResponseMapper } from './services/goods.responce.mapper';
import { GoodsEntity } from '../../database/entities/goods.entity';
import { EActive } from '../../common/enums/valiid.enum';

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
    createGoodDto: CreateGoodDto,
    file: Express.Multer.File,
    userData: IUserData,
  ) {
    if (file) {
      const filePath = await this.s3Serv.uploadFile(
        file,
        EFileTypes.User,
        userData.userId,
      );
      const user = this.goodsRepository.create({
        ...createGoodDto,
        image: filePath,
        user_id: userData.userId,
      });
      return await this.goodsRepository.save(user);
    }

    const user = this.goodsRepository.create({
      ...createGoodDto,
      user_id: userData.userId,
    });

    return await this.goodsRepository.save(user);
  }

  public async findAll(query: GoodsListRequestDto, userData: IUserData) {
    if (!userData) {
      const [entities, total] = await this.goodsRepository.getList(
        query,
        userData,
      );
      return GoodsResponseMapper.toResponseManyDto(entities, total, query);
    }
    const user = await this.userRepository.findOneBy({ id: userData.userId });

    const userPremium = user.userPremiumRights;

    const [entities, total] = await this.goodsRepository.getList(
      query,
      userData,
    );
    return userPremium === EType.Premium
      ? GoodsResponseMapper.PremResponseManyDto(entities, total, query)
      : GoodsResponseMapper.toResponseManyDto(entities, total, query);
  }

  public async findMyGoods(query: GoodsListRequestDto, userData: IUserData) {
    const [entities, total] = await this.goodsRepository.getUsersGoods(
      userData.userId,
      query,
    );

    return GoodsResponseMapper.PremResponseManyDto(entities, total, query);
  }
  public async findUserGoodsById(id: string) {
    const goods = await this.goodsRepository.find({
      where: {
        user_id: id,
      },
    });

    if (!goods) {
      throw new ForbiddenException('Not found');
    }
    return GoodsResponseMapper.responseDtoForMany(goods);
  }

  public async findOne(id: string, userData: IUserData) {
    if (!userData) {
      const goodsEntity = await this.goodsRepository.getById(id);
      return GoodsResponseMapper.toResponseDto(goodsEntity);
    }
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const userPremium = user.userPremiumRights;
    const goods = await this.goodsRepository.findOne({
      where: {
        id,
      },
    });

    await this.viewsRepository.save(
      this.viewsRepository.create({
        good_id: goods.id,
        user_id: userData.userId,
      }),
    );

    const goodsEntity = await this.goodsRepository.getById(id);
    return userPremium === EType.Premium
      ? GoodsResponseMapper.toResponseDtoViews(goodsEntity)
      : GoodsResponseMapper.toResponseDto(goodsEntity);
  }

  public async update(
    id: string,
    updateGoodDto: UpdateGoodDto,
    userData: IUserData,
  ) {
    const good = await this.goodsRepository.findOneBy({ id: id });
    if (good.user_id !== userData.userId) {
      throw new ForbiddenException('You cant edit a goods that not your own');
    }

    return await this.goodsRepository.save({
      ...good,
      active: EActive.Nonactive,
      check_of_valid: good.check_of_valid + 1,
      ...updateGoodDto,
    });
  }

  public async remove(id: string, userData: IUserData) {
    const { good, user } = await this.findGoodAndUser(id, userData.userId);

    if (good.user_id !== userData.userId && user.role !== ERights.Admin) {
      throw new ForbiddenException('You cant delete a good that not your own');
    }

    await this.s3Serv.deleteFile(good.image);
    await this.goodsRepository.remove(good);
  }
  public async like(id: string, userData: IUserData) {
    const { good, user } = await this.findGoodAndUser(id, userData.userId);

    if (good.user_id === userData.userId) {
      throw new ForbiddenException('You cant like a good that  your own good');
    }

    await this.likeRepository.save(
      this.likeRepository.create({ good_id: id, user_id: userData.userId }),
    );
  }
  public async dislike(id: string, userData: IUserData) {
    const { good, user } = await this.findGoodAndUser(id, userData.userId);
    if (good.user_id === userData.userId) {
      throw new ForbiddenException('You cant dislike a good that  your own ');
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
  public async buyGood(id: string, userData: IUserData) {
    const { good, user } = await this.findGoodAndUser(id, userData.userId);

    const users = await this.userRepository.findBy({
      role: ERights.Manager,
    });

    users.map(async (el) => {
      await this.emailService.send(el.email, EEmailAction.Buy, {
        name: user.name,
        email: user.email,
        city: user.city,
        title: good.title,
      });
    });
  }
  private async findGoodAndUser(
    goodId: string,
    userId: string,
  ): Promise<{ good: GoodsEntity; user: UserEntity }> {
    const good = await this.goodsRepository.findOneBy({ id: goodId });
    const user = await this.userRepository.findOneBy({ id: userId });
    return {
      good,
      user,
    };
  }

  public async addToFavorite(id: string, userData: IUserData) {
    const { good, user } = await this.findGoodAndUser(id, userData.userId);
    if (good.user_id === userData.userId) {
      throw new ForbiddenException('You cant add a good that  your own good');
    }

    if (good.favorite.includes(userData.userId)) {
      await this.goodsRepository.save(
        this.goodsRepository.create({
          ...good,
          favorite: [...good.favorite.filter((el) => el !== userData.userId)],
        }),
      );
      return 'You are removed good from your list';
    } else {
      await this.goodsRepository.save(
        this.goodsRepository.create({
          ...good,
          favorite: [...good.favorite, userData.userId],
        }),
      );
      return 'You are add good from your list';
    }
  }

  public async favoriteGoods(
    userId: string,
    @Query() query: GoodsListRequestDto,
  ) {
    const [goods, total] = await this.goodsRepository
      .createQueryBuilder('goods')
      .where('goods.favorite @> ARRAY[:userId]')
      .setParameter('userId', userId)
      .getManyAndCount();

    return GoodsResponseMapper.toResponseManyDto(goods, total, query);
  }
}
