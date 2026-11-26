import { Expose } from 'class-transformer';

export class AuditResponseDto {
  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
