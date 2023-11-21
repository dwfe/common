/**
 * https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
 */

export const isSomethingANumber = (data: any): boolean =>
  !isNaN(parseFloat(data)) &&
  isFinite(data)
;
