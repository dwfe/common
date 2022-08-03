import {getPropDescriptor} from './getPropDescriptor';

export function callGetter(obj: any, prop: string | symbol) {
  const descriptor = getPropDescriptor(obj, prop);
  return descriptor.get!.call(obj);
}
