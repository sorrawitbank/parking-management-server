import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { IsOnlyDate } from '../../../../../common/decorators';
import ErrorType from '../../../../../common/errors/error-type.enum';
import { toStartOfDayUtc } from '../../../../../common/utils';

export class GetRentDataQueryDto {
  @Min(0, { message: ErrorType.BELOW_MINIMUM })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  @Type(() => Number)
  readonly monthlyFee: number = 1000;

  @IsOnlyDate({ message: ErrorType.INVALID_FORMAT })
  @IsOptional()
  @Type(() => Date)
  readonly assignedDate: Date = toStartOfDayUtc(new Date());
}
