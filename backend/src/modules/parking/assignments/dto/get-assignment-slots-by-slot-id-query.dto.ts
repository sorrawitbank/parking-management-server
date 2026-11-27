import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { IsCurrentYearOrBefore } from '../../../../common/decorators';
import ErrorType from '../../../../common/enums/error-type.enum';

export class GetAssignmentSlotsBySlotIdQueryDto {
  @IsCurrentYearOrBefore({ message: ErrorType.ABOVE_MAXIMUM })
  @Min(2000, { message: ErrorType.BELOW_MINIMUM })
  @IsInt({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  @Type(() => Number)
  readonly year: number = new Date().getFullYear();
}
