import { Injectable } from '@nestjs/common';
import { addMonths, endOfMonth } from 'date-fns';
import { CANCEL_CONFIG, RENT_CONFIG } from '../../../common/configs';

@Injectable()
export class CalculationsService {
  calculateFee(assignedDate: Date, monthlyFee: number) {
    let fee =
      assignedDate.getDate() < RENT_CONFIG.DATE_NOT_HAVE_TO_PAY_THIS_MONTH
        ? (monthlyFee / 10) * Math.ceil((31 - assignedDate.getDate()) / 3)
        : 0;

    if (assignedDate.getDate() >= RENT_CONFIG.DATE_MUST_TO_PAY_NEXT_MONTH) {
      fee += monthlyFee;
    }

    return fee;
  }

  calculateCancelFee(endedDate: Date, monthlyFee: number) {
    const cancelFee =
      endedDate.getDate() >= CANCEL_CONFIG.DATE_MUST_TO_PAY_THIS_MONTH
        ? (monthlyFee / 10) * Math.floor(endedDate.getDate() / 3)
        : 0;

    return cancelFee;
  }

  calculatePaidUntilMonth(assignedDate: Date) {
    const paidUntilMonth = endOfMonth(
      addMonths(
        assignedDate,
        assignedDate.getDate() >= RENT_CONFIG.DATE_MUST_TO_PAY_NEXT_MONTH
          ? 1
          : 0,
      ),
    );

    return paidUntilMonth.toISOString().slice(0, 10);
  }
}
