import { TenantResponseDto } from './tenant-response.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

export class GetTenantsResponseDto extends PaginationResponseDto<TenantResponseDto> {}
