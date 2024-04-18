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
import { CreateGoodDto } from './dto/request/create-good.dto';
import { UpdateGoodDto } from './dto/request/update-car.dto';
import { GoodsEntity } from '../../database/entities/goods.entity';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';

@ApiTags('Goods')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  @ApiOperation({ summary: 'post a good by customer' })
  @RightsDecorator(ERights.Seller, ERights.Admin)
  @UseGuards(UserAccessGuard, PremiumAccessGuard, BannedAccessGuard)
  // @ApiFile('image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  public async create(
    @Body() createGoodDto: CreateGoodDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userData: IUserData,
  ): Promise<GoodsEntity> {
    console.log(file);
    console.log(createGoodDto);
    console.log(userData);
    return await this.goodsService.create(createGoodDto, file, userData);
  }

  @Get()
  @ApiOperation({ summary: 'get all goods' })
  @UseGuards(BannedAccessGuard)
  public async findAll(
    @Query() query: GoodsListRequestDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.goodsService.findAll(query, userData);
  }
  @UseGuards(BannedAccessGuard)
  @ApiOperation({ summary: 'get a car by id' })
  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.goodsService.findOne(id, userData);
  }
  @ApiOperation({ summary: 'update users car' })
  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGoodDto: UpdateGoodDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.goodsService.update(id, updateGoodDto, userData);
  }

  @ApiOperation({ summary: 'delete users car' })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.goodsService.remove(id, userData);
  }
  @Post('like/:id')
  @ApiOperation({ summary: 'like users car' })
  like(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.goodsService.like(id, userData);
  }
  @Delete('like/:id')
  @ApiOperation({ summary: 'dislike users car' })
  dislike(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.goodsService.dislike(id, userData);
  }
  @Post('buy/:id')
  @ApiOperation({ summary: 'create request to manager to buy a car' })
  @RightsDecorator(ERights.Costumer)
  @UseGuards(UserAccessGuard, BannedAccessGuard)
  buy(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.goodsService.buyCar(id, userData);
  }

  @Post('favorite/:id')
  @ApiOperation({ summary: 'add favorite to users list' })
  @RightsDecorator(ERights.Seller)
  @UseGuards(UserAccessGuard, BannedAccessGuard)
  favorite(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.goodsService.addToFavorite(id, userData);
  }
  @Delete('favorite/:id')
  @ApiOperation({ summary: 'add favorite to users list' })
  @RightsDecorator(ERights.Seller)
  @UseGuards(UserAccessGuard, BannedAccessGuard)
  remove_favorite(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.goodsService.removeFavorite(id, userData);
  }
  @Get('favorite/my')
  @ApiOperation({ summary: 'get favorite  users list' })
  @UseGuards(UserAccessGuard, BannedAccessGuard)
  myFavorites(@CurrentUser() userData: IUserData) {
    return this.goodsService.favoriteGoods(userData.userId);
  }
}
