interface AssignmentForeignKeyFields {
  tenantId: string;
}

interface AssignmentSlotForeignKeyFields {
  assignmentId: number;
  slotId: string;
}

interface ValidateAssignmentForeignKeyFieldsParams extends Partial<AssignmentForeignKeyFields> {}

interface ValidateAssignmentSlotForeignKeyFieldsParams extends Partial<AssignmentSlotForeignKeyFields> {}
