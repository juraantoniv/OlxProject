import { ViewsEntity } from '../../../../database/entities/views.entity';

export class CarListDto {
  id: string;
  location: string;
  region: string;
  user_id: string;
  image: string;
  price: number;
  title: string;
  created: Date;
  active: string;
  category: string;
  description: string;
  currency_type: string;
  likes: Array<any>;
}

export class CarsResponseDto {
  data: Partial<CarListDto[]>;
  total: number;
  limit: number;
  offset: number;
}

export class CarListPremDto extends CarListDto {
  views: ViewsEntity[];
}
