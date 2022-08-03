import {IObsMap, ObsMapChangeEventListenerParam} from '../contract';
import {ProxyChangeEmitter} from './proxy.change-emitter';
import {EventEmitter} from '../event-emitter';

export function createObsMap<K, V>(init: [K, V][] = []): IObsMap<K, V> {

  const emitter = new ProxyChangeEmitter<ObsMapChangeEventListenerParam<K, V>>(
    new EventEmitter<{ change: any }>()
  );
  const emitChange = emitter.emitChange.bind(emitter);
  const emitterHasProp = emitter.hasProp.bind(emitter);

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
      if (emitterHasProp(prop)) {
        const value = (emitter as any)[prop];
        return typeof value === 'function' ? value.bind(emitter) : value
      }
      const value = Reflect.get(map, prop, receiver);
      return typeof value === 'function' ? value.bind(map) : value;
    },
  }) as IObsMap<K, V>;
}
