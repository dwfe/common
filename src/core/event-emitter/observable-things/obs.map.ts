import {getProxyChangeEmitterHandlers} from './proxy.change-emitter';
import {IObsMap, ObsMapChangeEventListenerParam} from '../contract';

export function createObsMap<K, V>(init: [K, V][] | Map<K, V> = []): IObsMap<K, V> {
  const {emitChange, emitter} = getProxyChangeEmitterHandlers<ObsMapChangeEventListenerParam<K, V>>();
  return new Proxy<Map<K, V>>(new Map(init), {
    get(map, prop, receiver) {
      switch (prop) {
        case 'size':
          return map.size;

        case 'set':
          return (key: K, value: V) => {
            const oldValue = map.get.call(map, key);
            map.set.call(map, key, value);
            emitChange({
              key, oldValue, value,
              type: oldValue === undefined ? 'add' : 'update'
            });
            return receiver;
          };
        case 'delete':
          return (key: K): boolean => {
            const oldValue = map.get.call(map, key);
            if (oldValue === undefined) {
              return false;
            }
            map.delete.call(map, key);
            emitChange({key, oldValue, type: 'delete'});
            return true;
          };
        case 'clear':
          return (): void => {
            map.clear.call(map);
            emitChange({type: 'clear'});
          };

        case 'toString':
          return () => '[object ObsMap]';
      }
      let propValue = emitter[prop];
      if (propValue !== undefined) {
        return propValue;
      }
      propValue = Reflect.get(map, prop, receiver);
      return typeof propValue === 'function'
        ? propValue.bind(map) // because the Proxy does not have a [[MapData]] internal slot: https://tc39.es/ecma262/multipage/keyed-collections.html#sec-properties-of-map-instances
        : propValue;
    },
  }) as IObsMap<K, V>;
}
