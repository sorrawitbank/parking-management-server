import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Trim } from '../../common/decorators';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import ErrorType from '../../common/errors/error-type';

export class GetTenantsQueryDto extends PaginationQueryDto {
  @IsBoolean({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  readonly isRenting?: boolean;

  @IsString({ message: ErrorType.INVALID_TYPE })
  @IsOptional()
  @Trim()
  readonly keyword?: string;
}
