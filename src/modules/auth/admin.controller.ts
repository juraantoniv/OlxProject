import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ERights } from '../../common/enums/users.rights.enum';
import { CreateUserDto } from '../user/dto/request/create-user.dto';
import { UpdateUserDto } from '../user/dto/request/update-user.dto';
import { UserService } from '../user/services/user.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { RightsDecorator } from './decorators/user-rights.decorator';
import { SignInRequestDto } from './dto/request/sign-in.request.dto';
import { AuthUserResponseDto } from './dto/response/auth-user.response.dto';
import { LoginGuard } from './guards/login.check_before.rigts.guard';
import { UserAccessGuard } from './guards/user.access.guard';
import { IUserData } from './interfaces/user-data.interface';
import { AuthMapperWithTokens } from './services/auth.mapper';
import { AuthService } from './services/auth.service';

@ApiTags('Admin')
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
  @SkipAuth()
  @ApiOperation({ summary: 'Login' })
  @RightsDecorator(ERights.Admin)
  @UseGuards(LoginGuard)
  @Post('sign-in')
  public async signIn(
    @Body() dto: SignInRequestDto,
  ): Promise<AuthMapperWithTokens> {
    return await this.authService.signIn(dto);
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'user logout' })
  public async logout(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.logout(userData);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete user' })
  @RightsDecorator(ERights.Admin, ERights.Manager)
  @UseGuards(UserAccessGuard)
  @Delete('delete/:id')
  public async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.userService.remove(id);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update user' })
  @RightsDecorator(ERights.Admin, ERights.Manager)
  @UseGuards(UserAccessGuard)
  @Patch('update/:id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.userService.updateByAdmin(id, updateUserDto);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ban user' })
  @RightsDecorator(ERights.Admin, ERights.Manager)
  @UseGuards(UserAccessGuard)
  @Post('user_ban/:id')
  public async user_ban(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.userService.banUser(id);
  }
  @RightsDecorator(ERights.Admin)
  @UseGuards(UserAccessGuard)
  @ApiOperation({ summary: 'Manager Registration' })
  @Post('sign-up-manager')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  public async signUpManager(
    @Body() dto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AuthUserResponseDto> {
    return await this.authService.signUp(dto, file, true);
  }
}
