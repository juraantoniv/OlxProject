import { Inject, Injectable } from '@nestjs/common';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { Config, GoogleConfig } from '../../../common/configs/config.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private googleConfig: GoogleConfig;
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<GoogleConfig>('google').client_id,
      clientSecret: configService.get<GoogleConfig>('google').client_secret,
      callbackURL: configService.get<GoogleConfig>('google').call_back_url,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    console.log('accessToken', accessToken);
    const { id, name, emails } = profile;
    console.log('done', done);
    console.log(id, name.familyName, emails[0].value);

    const user = await this.authService.validateUser(
      profile.emails[0].value,
      profile.displayName,
    );

    return user || null;
  }
}
