import { Expose } from 'class-transformer';
import { TenantResponseDto } from './tenant-response.dto';

export class CreateTenantResponseDto extends TenantResponseDto {
  @Expose()
  createdAt: string;
}
