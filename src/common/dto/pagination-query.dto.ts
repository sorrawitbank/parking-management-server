import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  readonly limit: number = 10;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
