import { Expose } from 'class-transformer';
import { AssignmentResponseDto } from './assignment-response.dto';

export class GetAssignmentResponseDto extends AssignmentResponseDto {
  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
