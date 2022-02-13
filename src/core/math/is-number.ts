/**
 * https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
 */
export function isNumber(data: any): boolean {
  return !isNaN(data) && !isNaN(parseFloat(data)) && isFinite(data);
}
