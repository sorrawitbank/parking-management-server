import { Expose } from 'class-transformer';

export class TypeResponseDto {
  @Expose()
  vehicleTypeId: number;

  @Expose()
  nameTh: string;

  @Expose()
  nameEn: string;
}
