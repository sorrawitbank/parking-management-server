import { Expose } from 'class-transformer';

export class ProvinceResponseDto {
  @Expose()
  provinceId: number;

  @Expose()
  nameTh: string;

  @Expose()
  nameEn: string;
}
