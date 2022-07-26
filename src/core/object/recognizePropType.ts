import {PropType} from './contract';

export function recognizePropType(descriptor: PropertyDescriptor): PropType {
  let res: PropType = 'value';
  if (typeof descriptor.value === 'function') {
    res = 'method';
  } else if (!!descriptor.get) {
    res = 'accessor';
  }
  return res;
}
