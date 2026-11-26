import { OmitType } from '@nestjs/mapped-types';
import { Expose } from 'class-transformer';
import { AssignmentResponseDto } from './assignment-response.dto';

export class CreateAssignmentResponseDto extends OmitType(
  AssignmentResponseDto,
  ['assignmentSlots'] as const,
) {
  @Expose()
  createdAt: string;
}
