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
  [EEmailAction.Card_Brand]: {
    templateName: 'car_brand',
    subject: 'User have propose create new brand a car in bd',
  },
  [EEmailAction.Buy]: {
    templateName: 'buy_car',
    subject: 'Someone want buy your car',
  },
};
