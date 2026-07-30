import { Expose } from 'class-transformer';
import { TenantResponseDto } from './tenant-response.dto';

export class GetTenantResponseDto extends TenantResponseDto {
  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
