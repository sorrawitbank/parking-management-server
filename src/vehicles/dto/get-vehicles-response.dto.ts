import { OmitType } from '@nestjs/mapped-types';
import { VehicleResponseDto } from './vehicle-response.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

export class GetVehiclesResponse extends OmitType(VehicleResponseDto, [
  'note',
] as const) {}

export class GetVehiclesResponseDto extends PaginationResponseDto<GetVehiclesResponse> {}
