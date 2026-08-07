import { Expose } from 'class-transformer';

export class StatusResponseDto {
  @Expose()
  slotStatusId: number;

  @Expose()
  nameTh: string;

  @Expose()
  nameEn: string;

  @Expose()
  backgroundColorLight: string;

  @Expose()
  backgroundColorDark: string;

  @Expose()
  textColorLight: string;

  @Expose()
  textColorDark: string;
}
