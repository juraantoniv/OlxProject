import { ViewsEntity } from '../../../../database/entities/views.entity';

export class CarList {
  id: string;
  location: string;
  region: string;
  image: string;
  price: string;
  description: string;
  currency_type: string;
  likes: Array<any>;
  messages: Array<any>;
}

export class CarsResponseDto<T> {
  data: Partial<T>;
  total: number;
  limit: number;
  offset: number;
}

export class CarListPrem extends CarList {
  views: ViewsEntity[];
}