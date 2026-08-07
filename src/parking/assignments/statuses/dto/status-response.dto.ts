import { Expose } from 'class-transformer';
import { type Int4RangeValue } from '../../../../database/customs/int4range';

export class StatusResponseDto {
  @Expose()
  assignmentStatusId: number;

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

  @Expose()
  monthDiffRange: Int4RangeValue;
}
