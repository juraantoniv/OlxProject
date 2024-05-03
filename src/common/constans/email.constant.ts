import { EEmailAction } from '../enums/email.action.enum';

export const templates = {
  [EEmailAction.REGISTER]: {
    templateName: 'register',
    subject: 'Hello, great to see you in our app',
  },
  [EEmailAction.FORGOT_PASSWORD]: {
    templateName: 'forgot-password',
    subject: 'Do not worry, we control your password',
  },
  [EEmailAction.Change_Advertising]: {
    templateName: 'advertisement',
    subject: 'Pleas change your advertisement',
  },
  [EEmailAction.Buy]: {
    templateName: 'buy_good',
    subject: 'Someone want buy your good',
  },
  [EEmailAction.HELP]: {
    templateName: 'help',
    subject: 'User wants help',
  },
};
