import { IsUUID } from 'class-validator';

export class TenantIdDto {
  @IsUUID()
  readonly tenantId: string;
}
