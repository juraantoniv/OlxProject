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
// import { Module } from '@nestjs/common';
// import { MailerModule } from '@nestjs-modules/mailer';
//
// import { CustomConfigModule } from '../../common/config/config.module';
// import { emailTypeConfig } from './email.type.config';
// import { join } from 'path';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
//
// @Module({
//   imports: [
//     CustomConfigModule,
//     MailerModule.forRoot({
//       transport: {
//         service: emailConfig.service,
//         secure: false,
//         auth: {
//           user: emailConfig.user,
//           pass: emailConfig.pass,
//         },
//         tls: {
//           rejectUnauthorized: false,
//         },
//       },
//       defaults: {
//         from: emailConfig.defaults,
//       },
//       preview: false,
//       template: {
//         dir: join(process.cwd(), emailConfig.path),
//         adapter: new HandlebarsAdapter(),
//         options: {
//           strict: false,
//         },
//       },
//     }),
//   ],
//   providers: [],
//   exports: [],
// })
// export class CustomEmailModule {}
