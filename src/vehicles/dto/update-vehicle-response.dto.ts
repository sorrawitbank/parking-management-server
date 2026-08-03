import { Expose } from 'class-transformer';
import { VehicleResponseDto } from './vehicle-response.dto';

export class UpdateVehicleResponseDto extends VehicleResponseDto {
  @Expose()
  updatedAt: string;
}
