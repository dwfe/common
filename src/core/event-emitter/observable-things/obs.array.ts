import {IObsArray, ObsArrayChangeEventListenerParam} from '../contract';
import {getProxyChangeEmitterHandlers} from './proxy.change-emitter';

export function createObsArray<T = any>(init: T[] = []): IObsArray<T> {
  const {emitChange, emitter} = getProxyChangeEmitterHandlers<ObsArrayChangeEventListenerParam<T>>();
  return new Proxy<T[]>(init, {

    /**
     * Reading the Property value of the Target
     */
    get(array, prop, receiver) {
      // if (typeof prop === 'string' && !isNaN(prop as any)) { // get by index
      //   return array[prop as any];
      // }
      switch (prop) {
        case 'copyWithin':
          return (target: number, start: number, end?: number): typeof Proxy => {
            array.copyWithin(target, start, end);
            emitChange({type: 'copyWithin', target, start, end});
            return receiver;
          };
        case 'fill':
          return (value: any, start: number, end?: number): typeof Proxy => {
            array.fill(value, start, end);
            emitChange({type: 'fill', value, start, end});
            return receiver;
          }
        case 'pop':
          return (): T | undefined => {
            const value = array.pop();
            if (value !== undefined) {
              emitChange({type: 'pop', value})
            }
            return value;
          };
        case 'push':
          return (...items: T[]): number => {
            const newLength = array.push(...items);
            emitChange({type: 'push', items});
            return newLength;
          };
        case 'reverse':
          return (): typeof Proxy => {
            array.reverse();
            emitChange({type: 'reverse'});
            return receiver;
          };
        case 'shift':
          return (): T | undefined => {
            const value = array.shift();
            if (value !== undefined) {
              emitChange({type: 'shift', value})
            }
            return value;
          };
        case 'sort':
          return (compareFn?: (a: T, b: T) => number): typeof Proxy => {
            array.sort(compareFn);
            emitChange({type: 'sort'});
            return receiver;
          };

        // case 'splice':
        //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        //
        // case 'unshift':
        //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
      }
      return emitter[prop] === undefined
        ? Reflect.get(array, prop, receiver)
        : emitter[prop];
    },

    /**
     * Writing the Value to the Property of the Target
     */
    set(array, prop, value, receiver): boolean {
      const wasSet = Reflect.set(array, prop, value, receiver);
      if (wasSet) {
        if (typeof prop === 'string' && !isNaN(prop as any))
          emitChange({type: 'set-by-index', index: +prop, value});
        else if (prop === 'length')
          emitChange({type: 'set-length', value});
        else
          emitChange({type: 'set-prop', prop, value});
      }
      return wasSet;
    },

    /**
     * Deleting the Property of the Target
     */
    deleteProperty(arr, prop): boolean {
      const wasDeleted = Reflect.deleteProperty(arr, prop);
      if (wasDeleted) {
        emitChange({type: 'delete-prop', prop});
      }
      return wasDeleted;
    },

    // /**
    //  * Defining the Property of the Target
    //  */
    // defineProperty(arr, prop, descriptor): boolean {
    //   const wasDefined = Reflect.defineProperty(arr, prop, descriptor);
    //   if (wasDefined) {
    //     emitChange({type: 'define-prop', prop, descriptor});
    //   }
    //   return wasDefined;
    // }
  }) as IObsArray<T>;
}
