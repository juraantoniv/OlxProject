import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { CustomConfigModule } from '../../common/config/config.module';
import { emailTypeConfig } from './email.type.config';

@Module({
  imports: [CustomConfigModule, MailerModule.forRoot(emailTypeConfig)],
  providers: [],
  exports: [],
})
export class CustomEmailModule {}
