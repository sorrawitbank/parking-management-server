import { Expose } from 'class-transformer';

export class SlotResponseDto {
  @Expose()
  slotId: string;

  @Expose()
  slotNo: number;

  @Expose()
  slotCode: string;

  @Expose()
  positionLeft: number;

  @Expose()
  positionTop: number;

  @Expose()
  width: number;

  @Expose()
  height: number;

  @Expose()
  isUnavailable: boolean;
}
