import { IsInt, IsNotEmpty, Min } from 'class-validator';
import ErrorType from '../../../../common/errors/error-type';

export class StatusIdDto {
  @Min(1, { message: ErrorType.BELOW_MINIMUM })
  @IsInt({ message: ErrorType.INVALID_TYPE })
  @IsNotEmpty({ message: ErrorType.REQUIRED })
  readonly slotStatusId: number;
}
