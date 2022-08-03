import {EventEmitter, Listener} from '../event-emitter';

export type ObsMap<K, V> = Map<K, V> & {
  on(id: 'change', listener: Listener<ObsMapChangeEventListenerParam<K, V>>): void;
  off(id: 'change', listener: Listener<ObsMapChangeEventListenerParam<K, V>>): void;
  dispose(): void;
  hasListeners(): boolean;
  numberOfIds(): number;
  numberOfListeners(): number;
};

export type ObsMapChangeEventListenerParam<K, V> = {
  key?: K, oldValue?: V, value?: V,
  type: 'add' | 'update' | 'delete' | 'clear'
};

export function createObsMap<K, V>(init: [K, V][] = []): ObsMap<K, V> {

  const eventEmitter = new EventEmitter<{ change: ObsMapChangeEventListenerParam<K, V> }>();
  const emitChange = (data: ObsMapChangeEventListenerParam<K, V>) => {
    eventEmitter.emit('change', data);
  };

  return new Proxy<Map<K, V>>(new Map(init), {
    get(map, prop, receiver) {
      switch (prop) {
        case Symbol.toStringTag:
          return 'ObsMap';
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

        case 'size':
          return map.size;
        case 'toString':
          return () => '[object ObsMap]';

        case 'on':
          return (id: 'change', listener: Listener<ObsMapChangeEventListenerParam<K, V>>) => {
            eventEmitter.on(id, listener);
          };
        case 'off':
          return (id: 'change', listener: Listener<ObsMapChangeEventListenerParam<K, V>>) => {
            eventEmitter.off(id, listener);
          };
        case 'dispose':
          return () => eventEmitter.dispose();
        case 'hasListeners':
          return () => eventEmitter.hasListeners;
        case 'numberOfIds':
          return () => eventEmitter.numberOfIds;
        case 'numberOfListeners':
          return () => eventEmitter.numberOfListeners('change');
      }
      const value = Reflect.get(map, prop, receiver);
      return typeof value === 'function' ? value.bind(map) : value;
    },
  }) as ObsMap<K, V>;
}
