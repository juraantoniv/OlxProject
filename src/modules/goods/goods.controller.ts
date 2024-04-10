import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { CarsEntity } from '../../database/entities/cars.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RightsDecorator } from '../auth/decorators/user-rights.decorator';
import { BannedAccessGuard } from '../auth/guards/banned.access.guard';
import { PremiumAccessGuard } from '../auth/guards/premium.access.guard';
import { UserAccessGuard } from '../auth/guards/user.access.guard';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CarsService } from './cars.service';
import { ApiFile } from './decorators/api-file.decorator';
import { CarsListRequestDto } from './dto/request/cars-list-request.dto';
import { CreateCarDto } from './dto/request/create-car.dto';
import { UpdateCarDto } from './dto/request/update-car.dto';
import { CarList } from './dto/responce/cars.response.dto';

@Controller('cars')
@ApiTags('Cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @ApiOperation({ summary: 'post a car by customer' })
  @RightsDecorator(ERights.Seller, ERights.Admin)
  @UseGuards(UserAccessGuard, PremiumAccessGuard, BannedAccessGuard)
  // @ApiFile('image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  public async create(
    @Body() createCarDto: CreateCarDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userData: IUserData,
  ): Promise<CarsEntity> {
    console.log(file);
    console.log(createCarDto);
    console.log(userData);
    return await this.carsService.create(createCarDto, file, userData);
  }

  @Get()
  @ApiOperation({ summary: 'get all cars' })
  @UseGuards(BannedAccessGuard)
  public async findAll(
    @Query() query: CarsListRequestDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.carsService.findAll(query, userData);
  }
  @UseGuards(BannedAccessGuard)
  @ApiOperation({ summary: 'get a car by id' })
  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.carsService.findOne(id, userData);
  }
  @ApiOperation({ summary: 'update users car' })
  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.carsService.update(id, updateCarDto, userData);
  }

  @ApiOperation({ summary: 'delete users car' })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.carsService.remove(id, userData);
  }
  @Post('like/:id')
  @ApiOperation({ summary: 'like users car' })
  like(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.carsService.like(id, userData);
  }
  @Delete('like/:id')
  @ApiOperation({ summary: 'dislike users car' })
  dislike(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.carsService.dislike(id, userData);
  }
  @ApiOperation({ summary: 'create request to manager to buy a car' })
  @RightsDecorator(ERights.Costumer)
  @UseGuards(UserAccessGuard, BannedAccessGuard)
  @Post('buy/:id')
  buy(@Param('id') id: string, @CurrentUser() userData: IUserData) {
    return this.carsService.buyCar(id, userData);
  }
}
