import {IPropType} from './contract';

export function recognizePropType(descriptor: PropertyDescriptor): IPropType {
  if (typeof descriptor.value === 'function') {
    return 'method';
  } else if (descriptor.get && descriptor.set) {
    return 'accessor';
  } else if (descriptor.get) {
    return 'getter';
  } else if (descriptor.set) {
    return 'setter';
  }
  return 'value';
}
