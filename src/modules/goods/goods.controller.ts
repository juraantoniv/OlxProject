import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';

import { ERights } from '../../common/enums/users.rights.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RightsDecorator } from '../auth/decorators/user-rights.decorator';
import { BannedAccessGuard } from '../auth/guards/banned.access.guard';
import { PremiumAccessGuard } from '../auth/guards/premium.access.guard';
import { UserAccessGuard } from '../auth/guards/user.access.guard';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { GoodsService } from './goods.service';
import { ApiFile } from './decorators/api-file.decorator';
import { GoodsListRequestDto } from './dto/request/goods-list-request.dto';
import { CreateGoodDto, FileUploadDto } from './dto/request/create-good.dto';
import { UpdateGoodDto } from './dto/request/update-good.dto';
import { GoodsEntity } from '../../database/entities/goods.entity';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { JwtAccessGuardForAll } from '../auth/guards/jwt.access.for.all.guard';

@ApiTags('Goods')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  @ApiOperation({ summary: 'post a good by customer' })
  @RightsDecorator(ERights.Seller, ERights.Admin)
  @UseGuards(UserAccessGuard, PremiumAccessGuard, BannedAccessGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'add good',
    type: CreateGoodDto,
  })
  public async create(
    @Body() createGoodDto: CreateGoodDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userData: IUserData,
  ): Promise<GoodsEntity> {
    return await this.goodsService.create(createGoodDto, file, userData);
  }

  @SkipAuth()
  @Get()
  @ApiOperation({ summary: 'get all goods' })
  @UseGuards(JwtAccessGuardForAll)
  public async findAll(
    @Query() query: GoodsListRequestDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.goodsService.findAll(query, userData);
  }
  @SkipAuth()
  @ApiOperation({ summary: 'get a good by id' })
  @UseGuards(JwtAccessGuardForAll)
  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.goodsService.findOne(id, userData);
  }

  @UseGuards(BannedAccessGuard)
  @ApiOperation({ summary: 'get the user goods' })
  @Get('user/my')
  public async getMyGoods(
    @Query() query: GoodsListRequestDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.goodsService.findMyGoods(query, userData);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'get a user goods by id' })
  @Get('user/:id')
  public async getUserGoodsById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.goodsService.findUserGoodsById(id);
  }

  @ApiOperation({ summary: 'buy prem account' })
  @Post('user/buyPrem')
  public async buyPremAccount(@CurrentUser() userData: IUserData) {
    return await this.goodsService.buyPremAccount(userData);
  }

  @ApiOperation({ summary: 'update users good' })
  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGoodDto: UpdateGoodDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.goodsService.update(id, updateGoodDto, userData);
  }

  @ApiOperation({ summary: 'delete users good' })
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() userData: IUserData,
  ) {
    return this.goodsService.remove(id, userData);
  }
  @Post('like/:id')
  @ApiOperation({ summary: 'like users good' })
  like(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() userData: IUserData,
  ) {
    return this.goodsService.like(id, userData);
  }
  @Delete('like/:id')
  @ApiOperation({ summary: 'dislike users good' })
  dislike(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() userData: IUserData,
  ) {
    return this.goodsService.dislike(id, userData);
  }
  @Post('buy/:id')
  @ApiOperation({ summary: 'create request to manager to buy a good' })
  @RightsDecorator(ERights.Costumer)
  @UseGuards(UserAccessGuard, BannedAccessGuard)
  buy(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.goodsService.buyGood(id, userData);
  }

  @Post('favorite/:id')
  @ApiOperation({ summary: 'add favorite to users list' })
  @UseGuards(UserAccessGuard, BannedAccessGuard)
  favorite(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.goodsService.addToFavorite(id, userData);
  }

  @Get('favorite/my')
  @ApiOperation({ summary: 'get favorite  users list' })
  @UseGuards(UserAccessGuard)
  myFavorites(
    @CurrentUser() userData: IUserData,
    @Query() query: GoodsListRequestDto,
  ) {
    return this.goodsService.favoriteGoods(userData.userId, query);
  }

  @Get('statics/all')
  @ApiOperation({ summary: 'get all goods with statics' })
  // @RightsDecorator(ERights.Admin)
  // @UseGuards(UserAccessGuard)
  public async getStatics(
    @Query() query: GoodsListRequestDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.goodsService.findStatics(query);
  }
}
