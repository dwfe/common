/**
 * https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
 */
export const isNumber = (data: any): boolean =>
  !Number.isNaN(data) &&
  !Number.isNaN(parseFloat(data)) &&
  isFinite(data)
;

