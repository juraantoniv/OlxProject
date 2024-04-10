import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import * as dotenv from 'dotenv';
import { join } from 'path';

import getConfigs from '../../configs/configs';

dotenv.config({ path: './environments/local.env' });

const emailConfig = getConfigs().email;

export const emailTypeConfig: MailerOptions = {
  transport: {
    service: emailConfig.service,
    secure: false,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  defaults: {
    from: emailConfig.defaults,
  },
  preview: false,
  template: {
    dir: join(process.cwd(), emailConfig.path),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: false,
    },
  },
};
