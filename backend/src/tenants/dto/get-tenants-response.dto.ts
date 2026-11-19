import { OmitType } from '@nestjs/mapped-types';
import { TenantResponseDto } from './tenant-response.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

export class GetTenantsResponse extends OmitType(TenantResponseDto, [
  'note',
] as const) {}

export class GetTenantsResponseDto extends PaginationResponseDto<GetTenantsResponse> {}
