import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,

} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { UserService } from './services/user.service';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import {
  SendHelpMessageDto,
  SendMessageDto,
} from './dto/request/create-user.dto';
import { UserEntity } from '../../database/entities/user.entity';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: 'get all users' })
  @Get()
  public async findAll() {
    return await this.userService.findAll();
  }
  @SkipAuth()
  @ApiOperation({ summary: 'get user by id' })
  @ApiBearerAuth()
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }
  @ApiOperation({ summary: 'update user' })
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
  public async me(
    @CurrentUser() userData: IUserData,
  ): Promise<Partial<UserEntity>> {
    return await this.userService.me(userData);
  }
  @ApiOperation({ summary: 'help user' })
  @ApiBearerAuth()
  @Post('user/help')
  public async help(
    @CurrentUser() userData: IUserData,
    @Body() dto: SendHelpMessageDto,
  ) {
    return await this.userService.help(userData, dto.message, dto.subject);
  }

  @ApiOperation({ summary: 'send_message' })
  @ApiBearerAuth()
  @Post('send_message/:id')
  public async sendMessage(
    @CurrentUser() userData: IUserData,
    @Param('id') id: string,
    @Body() massage: SendMessageDto,
  ) {
    return await this.userService.sendMessage(massage.message, id, userData);
  }

  @ApiOperation({ summary: 'my_messages' })
  @ApiBearerAuth()
  @Post('my_messages')
  public async myMessages(@CurrentUser() userData: IUserData) {
    return await this.userService.myMessages(userData);
  }
}
