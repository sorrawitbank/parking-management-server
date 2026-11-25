import { PickType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { AssignmentResponseDto } from '../../dto/assignment-response.dto';

export class GetRentDataResponseDto extends PickType(AssignmentResponseDto, [
  'paidUntilMonth',
] as const) {
  @Expose()
  fee: number;
}
