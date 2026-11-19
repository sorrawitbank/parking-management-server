import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import ErrorType from '../errors/error-type.enum';

export class PaginationQueryDto {
  @Min(1, { message: ErrorType.BELOW_MINIMUM })
  @IsInt({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  @Type(() => Number)
  readonly page: number = 1;

  @Max(100, { message: ErrorType.ABOVE_MAXIMUM })
  @Min(2, { message: ErrorType.BELOW_MINIMUM })
  @IsInt({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  @Type(() => Number)
  readonly limit: number = 10;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
