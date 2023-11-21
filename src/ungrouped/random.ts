/**
 * Псевдо-случайное число из заданного диапазона.
 * minInclusive и maxInclusive границы включаются, т.е. они могут оказаться в результате работы функции.
 *
 *   https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript#7228322
 *
 */
export function randomIntFromRange(minInclusive: number, maxInclusive: number) {
  return Math.floor(Math.random() * (maxInclusive - minInclusive + 1) + minInclusive);
}

/**
 * Псевдо-случайное число из заданного диапазона.
 * Число не должно совпасть с каким-либо числом из массива exclude.
 */
export function randomIntFromRangeExclude(minInclusive: number, maxInclusive: number, exclude: number[] = []) {
  let result: number;
  do {
    result = randomIntFromRange(minInclusive, maxInclusive);
  } while (exclude.includes(result));
  return result;
}
