import { Expose } from 'class-transformer';
import { AssignmentSlotResponseDto } from './assignment-slot-response.dto';

export class AssignmentSlotWithAssignedDaysResponseDto extends AssignmentSlotResponseDto {
  @Expose()
  assignedDays: number;
}
