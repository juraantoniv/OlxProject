export class StaticsEntity {
  goods_region: string;
  sum: string;
}

export class StaticsResponseDto {
  value: string;
  label: string;
}

export class StaticsMapper {
  public static toResponseDto(entity: StaticsEntity): StaticsResponseDto {
    return {
      label: entity.goods_region,
      value: entity.sum,
    };
  }

  public static toResponseDtoForMany(
    entity: StaticsEntity[],
  ): StaticsResponseDto[] {
    return entity.map(this.toResponseDto);
  }
}
