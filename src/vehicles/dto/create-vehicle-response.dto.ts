import { Expose } from 'class-transformer';
import { VehicleResponseDto } from './vehicle-response.dto';

export class CreateVehicleResponseDto extends VehicleResponseDto {
  @Expose()
  createdAt: string;
}
