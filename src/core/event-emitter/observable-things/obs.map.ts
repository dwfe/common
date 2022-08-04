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
            emitChange({
              key, oldValue, value,
              type: oldValue === undefined ? 'add' : 'update'
            });
            return receiver;
          };
        case 'delete':
          return (key: K): boolean => {
            const oldValue = map.get(key);
            if (oldValue === undefined) {
              return false;
            }
            map.delete(key);
            emitChange({key, oldValue, type: 'delete'});
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
      if (emitter[prop] !== undefined) {
        return emitter[prop];
      }
      const res = (map as any)[prop];  // we're not using the receiver argument at all,
      return typeof res === 'function' // because the Proxy does not have a [[MapData]] internal slot: https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-map-instances
        ? res.bind(map)                // instead, the target itself is used as the receiver
        : res;
    },
  }) as IObsMap<K, V>;
}
