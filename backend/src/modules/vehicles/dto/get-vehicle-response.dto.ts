import { Expose } from 'class-transformer';
import { VehicleResponseDto } from './vehicle-response.dto';

export class GetVehicleResponseDto extends VehicleResponseDto {
  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
