import { IsInt, Max, Min } from 'class-validator';

export class ProvinceIdDto {
  @IsInt()
  @Min(10)
  @Max(99)
  provinceId: number;
}
