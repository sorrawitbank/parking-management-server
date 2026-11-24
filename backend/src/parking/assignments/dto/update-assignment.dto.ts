import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { CreateAssignmentDto } from './create-assignment.dto';
import { SlotIdDto } from '../../slots/dto/slot-id.dto';
import ErrorType from '../../../common/errors/error-type.enum';

export class UpdateAssignmentDto extends PartialType(
  PickType(CreateAssignmentDto, ['tenantId', 'monthlyFee'] as const),
  { skipNullProperties: false },
) {}

export class PayAssignmentDto {
  @Max(12, { message: ErrorType.ABOVE_MAXIMUM })
  @Min(1, { message: ErrorType.BELOW_MINIMUM })
  @IsInt({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  readonly months: number = 1;
}

export class MoveAssignmentDto extends SlotIdDto {}
