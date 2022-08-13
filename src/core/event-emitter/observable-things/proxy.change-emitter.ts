import {Listener, ObsValueLike} from '../contract';
import {EventEmitter} from '../event-emitter';

export function getProxyChangeEmitterHandlers<ListenerParam = any>() {
  const eventEmitter = new EventEmitter<{ change: any }>();
  const emitter = Object.create(null) as ObsValueLike<any, ListenerParam>;

  emitter.canBeObservable = true;

  emitter.on = (id: any, listener: Listener<ListenerParam>) => eventEmitter.on(id, listener);
  emitter.off = (id, listener: Listener<ListenerParam>) => eventEmitter.off(id, listener);
  emitter.dispose = () => eventEmitter.dispose();

  Object.defineProperty(emitter, 'hasListeners', {
    get: () => eventEmitter.hasListeners,
  });
  emitter.numberOfListeners = () => eventEmitter.numberOfListeners('change');
  Object.defineProperty(emitter, 'numberOfIds', {
    get: () => eventEmitter.numberOfIds,
  });

  return {
    emitChange: (data: ListenerParam) => eventEmitter.emit('change', data),
    emitter: emitter as any,
  };
}
