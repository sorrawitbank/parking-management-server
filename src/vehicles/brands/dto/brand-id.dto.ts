import { IsInt, Min } from 'class-validator';

export class BrandIdDto {
  @IsInt()
  @Min(1)
  readonly vehicleBrandId: number;
}
