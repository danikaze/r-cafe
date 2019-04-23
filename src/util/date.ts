/**
 * @returns Date as M/D/YYYY
 */
export function getAmericanDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}/${day}/${year}`;
}

/**
 * @returns Date as YYYYMMDD
 */
export function getNumericDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

/**
 * @param weekOffset `1` is next week, `-1` previous week, etc.
 * @returns list of Dates from Monday to Friday
 */
export function getWorkDays(weekOffset = 0): Date[] {
  const week = [];
  const DAY_MS = 86400000;
  const DAYS_WEEK = 7;
  const DAYS_WEEKDAYS = 5;

  const today = new Date();
  const monday = today.getTime() - DAY_MS * (today.getDay() - 1) + weekOffset * DAYS_WEEK * DAY_MS;

  for (let i = 0; i < DAYS_WEEKDAYS; i++) {
    week.push(new Date(monday + DAY_MS * i));
  }

  return week;
}
