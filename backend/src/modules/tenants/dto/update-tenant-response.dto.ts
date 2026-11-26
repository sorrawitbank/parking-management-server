import { IntersectionType, PickType } from '@nestjs/mapped-types';
import { TenantResponseDto } from './tenant-response.dto';
import { AuditResponseDto } from '../../../common/dto/audit-response.dto';

export class UpdateTenantResponseDto extends IntersectionType(
  TenantResponseDto,
  PickType(AuditResponseDto, ['updatedAt'] as const),
) {}
