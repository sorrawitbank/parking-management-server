type RentForeignKeyFields = AssignmentForeignKeyFields &
  Pick<AssignmentSlotForeignKeyFields, 'slotId'>;

interface RentParams extends RentForeignKeyFields {
  monthlyFee: number;
  assignedDate: Date;
}

interface PayParams {
  months: number;
}

interface MoveParams {
  slotId: string;
}
