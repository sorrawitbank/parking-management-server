import { IsInt, IsOptional, Max, Min } from 'class-validator';
import ErrorType from '../errors/error-type';

export class PaginationQueryDto {
  @Min(1, { message: ErrorType.BELOW_MINIMUM })
  @IsInt({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  readonly page: number = 1;

  @Max(100, { message: ErrorType.ABOVE_MAXIMUM })
  @Min(2, { message: ErrorType.BELOW_MINIMUM })
  @IsInt({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  readonly limit: number = 10;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
