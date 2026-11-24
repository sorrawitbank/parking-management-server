import { Expose } from 'class-transformer';

export class GetCancelDataResponseDto {
  @Expose()
  cancelFee: number;
}
