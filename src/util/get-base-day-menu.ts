import { WeekMenu } from '../def';
import { getNumericDate } from './date';

export function getBaseDayMenu(day: Date) {
  const dayKey = getNumericDate(day);
  const menu = {
    [dayKey]: {
      '9f': { day: [], night: [] },
      '22f': { day: [], night: [] },
      rise: { day: [], night: [] },
      osaka: { day: [], night: [] },
    },
  } as WeekMenu;

  return { dayKey, menu };
}
