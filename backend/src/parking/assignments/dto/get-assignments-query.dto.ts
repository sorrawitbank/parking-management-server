import { IsOptional, IsUUID } from 'class-validator';
import { ParseStringArray } from '../../../common/decorators';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import ErrorType from '../../../common/errors/error-type.enum';

export class GetAssignmentsQueryDto extends PaginationQueryDto {
  @IsUUID(4, { each: true, message: ErrorType.INVALID_FORMAT })
  @IsOptional()
  @ParseStringArray()
  readonly slotIds?: string[];
}
