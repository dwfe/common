import {isSomethingANumber} from './isSomethingANumber';

/**
 * Положительное число — действительное число, которое больше нуля.
 */
export function isPositiveNumber(value: any) {
  if (typeof value !== 'number') return false;
  return isSomethingANumber(value) && value > 0;
}
