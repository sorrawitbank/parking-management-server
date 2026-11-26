import { Expose } from 'class-transformer';
import { TenantResponseDto } from './tenant-response.dto';

export class UpdateTenantResponseDto extends TenantResponseDto {
  @Expose()
  updatedAt: string;
}
