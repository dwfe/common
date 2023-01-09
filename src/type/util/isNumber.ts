/**
 * https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
 */

export const isNumber = (data: any): boolean =>
  !isNaN(parseFloat(data)) &&
  isFinite(data)
;

export const isNumberStrict = (data: any): boolean =>
  typeof data === 'number' &&
  isFinite(data)
;
