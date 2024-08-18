import {hexChars} from '../constant';

/**
 * https://stackoverflow.com/questions/1484506/random-color-generator
 */
export function getRandomColor(): string {
  let result = '#';
  const {length} = hexChars;
  for (let i = 0; i < 6; i++) {
    result += hexChars[Math.floor(Math.random() * length)];
  }
  return result;
}
