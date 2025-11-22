import {IRgba} from './contract';

export function rgbaToString(value: IRgba) {
  return `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`;
}
