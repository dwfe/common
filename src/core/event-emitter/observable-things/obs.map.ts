import {getProxyChangeEmitterHandlers} from './proxy.change-emitter';
import {IObsMap} from '../contract';

export function createObsMap<K, V>(init: [K, V][] | Map<K, V> = []): IObsMap<K, V> {
  const {emitChange, emitter} = getProxyChangeEmitterHandlers();
  return new Proxy<Map<K, V>>(new Map(init), {
    get(map, prop, receiver) {
      switch (prop) {
        case 'size':
          return map.size;

        case 'set':
          return (key: K, value: V) => {
            const oldValue = map.get(key);
            map.set(key, value);
            emitChange({
              key, oldValue, value,
              type: oldValue === undefined ? 'add' : 'update'
            });
            return this;
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
      let result = emitter[prop];
      if (result === undefined) {
        result = Reflect.get(map, prop, receiver);
      }
      return typeof result === 'function' ? result.bind(map) : result;
    },
  }) as IObsMap<K, V>;
}
