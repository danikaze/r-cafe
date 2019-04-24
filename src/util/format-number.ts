/**
 * Format a number separating each 3 value with commas
 *
 * @param  value Value to format
 * @return       Formatted value
 *
 * @example
 * formatNumber(12345678); // 12,345,678
 *
 */
export function formatNumber(value: number | string): string {
  // tslint:disable-next-line
  if (value == null) {
    return '';
  }

  return String(value).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
