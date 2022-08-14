import {getProxyChangeEmitterHandlers} from './proxy.change-emitter';
import {IObsMap, ObsMapChangeEventListenerParam} from '../contract';

export function createObsMap<K, V>(init: [K, V][] | Map<K, V> = []): IObsMap<K, V> {
  const {emitChange, emitter} = getProxyChangeEmitterHandlers<ObsMapChangeEventListenerParam<K, V>>();
  return new Proxy<Map<K, V>>(new Map(init), {

    /**
     * Reading the Property value of the Target
     */
    get(map, prop, receiver) {
      switch (prop) {
        case 'set':
          return (key: K, value: V): typeof Proxy => {
            const oldValue = map.get(key);
            map.set(key, value);
            emitChange(oldValue === undefined
              ? {type: 'add', key, value}
              : {type: 'update', key, oldValue, value});
            return receiver;
          };
        case 'delete':
          return (key: K): boolean => {
            const value = map.get(key);
            if (value === undefined) {
              return false;
            }
            map.delete(key);
            emitChange({type: 'delete', key, value});
            return true;
          };
        case 'clear':
          return (): void => {
            map.clear();
            emitChange({type: 'clear'});
          };

        case 'toString':
          return () => '[object ObsMap]';
      }
      const emitterPropValue = emitter[prop];
      if (emitterPropValue !== undefined) {
        return emitterPropValue;
      }
      const res = (map as any)[prop];  // we're not using the receiver argument at all,
      return typeof res === 'function' // because the Proxy does not have a [[MapData]] trap: https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-map-instances
        ? res.bind(map)                // instead, the target itself is used as the receiver
        : res;
    },

    /**
     * Writing the Value to the Property of the Target
     */
    set(map, prop, value): boolean {
      (map as any)[prop] = value;
      emitChange({type: 'set-prop', prop, value});
      return true;
    },

    /**
     * Deleting the Property of the Target
     */
    deleteProperty(map, prop): boolean {
      const wasDeleted = Reflect.deleteProperty(map, prop);
      if (wasDeleted) {
        emitChange({type: 'delete-prop', prop});
      }
      return wasDeleted;
    },

  }) as IObsMap<K, V>;
}
