import {IObsMap, Listener, ObsMapChangeEventListenerParam} from '../contract';
import {EventEmitter} from '../event-emitter';
import {callGetter} from '../../object';

export function createObsMap<K, V>(init: [K, V][] = []): IObsMap<K, V> {

  const eventEmitter = new EventEmitter<{ change: ObsMapChangeEventListenerParam<K, V> }>();
  const emitChange = (data: ObsMapChangeEventListenerParam<K, V>) => {
    eventEmitter.emit.call(eventEmitter, 'change', data);
  };

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

        case 'canBeObservable':
          return true;
        case 'on':
          return (id: 'change', listener: Listener<ObsMapChangeEventListenerParam<K, V>>) => {
            eventEmitter.on.call(eventEmitter, id, listener);
          };
        case 'off':
          return (id: 'change', listener: Listener<ObsMapChangeEventListenerParam<K, V>>) => {
            eventEmitter.off.call(eventEmitter, id, listener);
          };
        case 'dispose':
          return () => eventEmitter.dispose.call(eventEmitter);
        case 'numberOfIds':
          return callGetter(eventEmitter, 'numberOfIds');
        case 'hasListeners':
          return callGetter(eventEmitter, 'hasListeners');
        case 'numberOfListeners':
          return eventEmitter.numberOfListeners.call(eventEmitter, 'change');
      }
      const value = Reflect.get(map, prop, receiver);
      return typeof value === 'function' ? value.bind(map) : value;
    },
  }) as IObsMap<K, V>;
}
