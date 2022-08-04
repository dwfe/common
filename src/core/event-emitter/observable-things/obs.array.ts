import {IObsArray, ObsArrayChangeEventListenerParam} from '../contract';
import {getProxyChangeEmitterHandlers} from './proxy.change-emitter';

export function createObsArray<T = any>(init: T[] = []): IObsArray<T> {
  const {emitChange, emitter} = getProxyChangeEmitterHandlers<ObsArrayChangeEventListenerParam<T>>();
  return new Proxy<T[]>(init, {

    /**
     * Reading the Property value of the Target
     */
    get(array, prop, receiver) {
      if (typeof prop === 'string' && !isNaN(prop as any)) { // get by index
        return array[prop as any];
      }
      switch (prop) {

        // case 'copyWithin':
        //   https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin
        //
        // case 'fill':
        //   https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/fill

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

        // case 'reverse':
        //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse
        //
        // case 'shift':
        //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
        //
        // case 'sort':
        //   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        //
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
    set(array: T[], prop: string | symbol, value, receiver): boolean {
      const valueWasSet = Reflect.set(array, prop, value, receiver);
      if (valueWasSet) {
        if (typeof prop === 'string' && !isNaN(prop as any)) {
          emitChange({type: 'set-by-index', index: +prop, value});
        }
        if (prop === 'length')
          emitChange({type: 'set-length', value});
      }
      return valueWasSet;
    },
  }) as IObsArray<T>;
}
