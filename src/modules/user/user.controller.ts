import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { log } from 'console';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserService } from './services/user.service';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: 'get all users' })
  @Get()
  public async findAll() {
    return await this.userService.findAll();
  }
  @ApiOperation({ summary: 'get user by id' })
  @ApiBearerAuth()
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
  @ApiOperation({ summary: 'update by user his data' })
  @ApiBearerAuth()
  @Patch()
  public async update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() userData: IUserData,
  ) {
    return await this.userService.update(updateUserDto, userData);
  }
  @ApiOperation({ summary: 'get me' })
  @ApiBearerAuth()
  @Get('user/me')
  public async me(@CurrentUser() userData: IUserData) {
    return await this.userService.me(userData);
  }

  @ApiOperation({ summary: 'send_message' })
  @ApiBearerAuth()
  @Post('send_message/:id')
  public async sendMessage(
    @CurrentUser() userData: IUserData,
    @Param('id') id: string,
    @Body('massage') massage: string,
  ) {
    return await this.userService.sendMessage(massage, id, userData);
  }

  @ApiOperation({ summary: 'my_messages' })
  @ApiBearerAuth()
  @Post('my_messages')
  public async myMessages(@CurrentUser() userData: IUserData) {
    return await this.userService.myMessages(userData);
  }
}
