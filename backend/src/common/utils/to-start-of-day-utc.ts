import { addMinutes, startOfDay } from 'date-fns';

function toStartOfDayUtc(date: Date) {
  return addMinutes(startOfDay(date), -date.getTimezoneOffset());
}

export default toStartOfDayUtc;
