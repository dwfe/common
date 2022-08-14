import {IObsSet, ObsSetChangeEventListenerParam} from '../contract';
import {getProxyChangeEmitter} from './proxy.change-emitter';

export function createObsSet<T = any>(init: Set<T> | T[] | null = null): IObsSet<T> {
  const {emitter, emitChange} = getProxyChangeEmitter<ObsSetChangeEventListenerParam<T>>();
  return new Proxy<Set<T>>(new Set(init), {

    /**
     * Reading the Property value of the Target
     */
    get(set, prop, receiver) {
      switch (prop) {
        case 'add':
          return (value: T): typeof Proxy => {
            if (!set.has(value)) {
              set.add(value);
              emitChange({type: 'add', value});
            }
            return receiver;
          };
        case 'delete':
          return (value: T): boolean => {
            if (!set.has(value)) {
              return false;
            }
            set.delete(value);
            emitChange({type: 'delete', value});
            return true;
          };
        case 'clear':
          return (): void => {
            if (set.size === 0) {
              return;
            }
            set.clear();
            emitChange({type: 'clear'});
          };

        case 'toString':
          return () => '[object ObsSet]';
      }
      const emitterPropValue = emitter[prop];
      if (emitterPropValue !== undefined) {
        return emitterPropValue;
      }
      const res = (set as any)[prop];  // we're not using the receiver argument at all,
      return typeof res === 'function' // because the Proxy does not have a [[SetData]] trap: https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-set-instances
        ? res.bind(set)                // instead, the target itself is used as the receiver
        : res;
    },

    /**
     * Writing the Value to the Property of the Target
     */
    set(set, prop, value): boolean {
      (set as any)[prop] = value;
      emitChange({type: 'set-prop', prop, value});
      return true;
    },

    /**
     * Deleting the Property of the Target
     */
    deleteProperty(set, prop): boolean {
      const wasDeleted = Reflect.deleteProperty(set, prop);
      if (wasDeleted) {
        emitChange({type: 'delete-prop', prop});
      }
      return wasDeleted;
    },

  }) as IObsSet<T>;
}
