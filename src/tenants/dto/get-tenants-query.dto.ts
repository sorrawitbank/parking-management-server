import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class GetTenantsQueryDto extends PaginationQueryDto {
  @IsBoolean()
  @IsOptional()
  readonly isRenting?: boolean;

  @IsString()
  @IsOptional()
  readonly keyword?: string;
}
