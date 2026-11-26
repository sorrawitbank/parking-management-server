import { Expose } from 'class-transformer';

export class TenantResponseDto {
  @Expose()
  tenantId: string;

  @Expose()
  name: string;

  @Expose()
  phone: string | null;

  @Expose()
  lineId: string | null;

  @Expose()
  note: string | null;
}
