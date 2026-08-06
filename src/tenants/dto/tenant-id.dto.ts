import { IsNotEmpty, IsUUID } from 'class-validator';
import { Trim } from '../../common/decorators';
import ErrorType from '../../common/errors/error-type';

export class TenantIdDto {
  @IsUUID(4, { message: ErrorType.INVALID_FORMAT })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  @Trim()
  readonly tenantId: string;
}
