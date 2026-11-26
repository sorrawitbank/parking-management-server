import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, MaxDate, Min, MinDate } from 'class-validator';
import { addDays } from 'date-fns';
import { SlotIdDto } from '../../slots/dto/slot-id.dto';
import { TenantIdDto } from '../../../tenants/dto/tenant-id.dto';
import { IsOnlyDate } from '../../../../common/decorators';
import ErrorType from '../../../../common/errors/error-type.enum';
import { toStartOfDayUtc } from '../../../../common/utils';

export class CreateAssignmentDto extends IntersectionType(
  TenantIdDto,
  SlotIdDto,
) {
  @Min(0, { message: ErrorType.BELOW_MINIMUM })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  readonly monthlyFee: number;

  @MaxDate(() => toStartOfDayUtc(addDays(new Date(), 14)), {
    message: ErrorType.ABOVE_MAXIMUM,
  })
  @MinDate(() => toStartOfDayUtc(addDays(new Date(), -7)), {
    message: ErrorType.BELOW_MINIMUM,
  })
  @IsOnlyDate({ message: ErrorType.INVALID_FORMAT })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  @Type(() => Date)
  readonly assignedDate: Date;
}
