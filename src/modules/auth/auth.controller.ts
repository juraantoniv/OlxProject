import {
  Body,
  Controller,
  Header,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes, ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import {
  ChangePasswordRequestDto,
  ConfirmPasswordRequestDto,
  RecoveryPasswordRequestDto,
} from './dto/request/change-password.request.dto';
import {
  SignInRequestDto,
  SingInByGoogleDto,
} from './dto/request/sign-in.request.dto';
import {
  AuthUserResponseDto,
  AuthUserResponseTokensDto,
} from './dto/response/auth-user.response.dto';
import {
  AccessTokenDto,
  TokenResponseDto,
} from './dto/response/token.responce.dto';
import { JwtRefreshGuard } from './guards/jwt.refresh.guard';
import { IUserData } from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from '../user/dto/request/create-user.dto';
import { BannedAccessGuard } from './guards/banned.access.guard';
import { TokensRequestDto } from './dto/request/tokens.request.dto';
import { CreateGoodDto } from '../goods/dto/request/create-good.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Registration' })
  @Post('sign-up')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  public async signUp(
    @Body() dto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AuthUserResponseDto> {
    return await this.authService.signUp(dto, file);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Login' })
  @Post('sign-in')
  public async signIn(
    @Body() dto: SignInRequestDto,
  ): Promise<AuthUserResponseTokensDto> {
    return await this.authService.signIn(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Login by Google' })
  @Post('sign-in/google')
  public async signGoogle(
    @Body() body: SingInByGoogleDto,
  ): Promise<AuthUserResponseTokensDto> {
    return await this.authService.signInByGoogle(body);
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiHeader({
    name: 'access_token',
    description: 'pass value of token to header',
    required: true,
  })
  public async logout(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.logout(userData);
  }

  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Update token pair' })
  @Post('refresh')
  public async updateRefreshToken(
    @CurrentUser() userData: IUserData,
    @Body() token: TokensRequestDto,
  ): Promise<TokenResponseDto> {
    return await this.authService.refreshToken(userData, token.refresh_token);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'change password' })
  @Post('change_password')
  public async changePassword(
    @CurrentUser() userData: IUserData,
    @Body() body: ChangePasswordRequestDto,
  ): Promise<void> {
    return await this.authService.changePassword(body, userData);
  }
  @SkipAuth()
  @ApiOperation({ summary: 'recovery password' })
  @Post('recovery_password')
  public async recoveryPassword(
    @Body() body: RecoveryPasswordRequestDto,
  ): Promise<void> {
    return await this.authService.recoveryPassword(body);
  }
  @SkipAuth()
  @ApiOperation({ summary: 'recovery password' })
  @Post('confirm_password/:token')
  public async confirmPassword(
    @Param('token') token: string,
    @Body() body: ConfirmPasswordRequestDto,
  ): Promise<string> {
    return await this.authService.confirmPassword(token, body);
  }
}
