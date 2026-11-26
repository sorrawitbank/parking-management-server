import { Expose } from 'class-transformer';

export class BrandResponseDto {
  @Expose()
  vehicleBrandId: number;

  @Expose()
  nameTh: string;

  @Expose()
  nameEn: string;
}
