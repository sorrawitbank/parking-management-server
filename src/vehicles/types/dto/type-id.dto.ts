import { IsInt, Min } from 'class-validator';

export class TypeIdDto {
  @IsInt()
  @Min(1)
  readonly vehicleTypeId: number;
}
