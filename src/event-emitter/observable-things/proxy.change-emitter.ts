import {Listener, ObsValueLike} from '../contract';
import {EventEmitter} from '../event-emitter';

export function getProxyChangeEmitter<ListenerParam = any>() {
  const innerEmitter = new EventEmitter<{ change: any }>();
  const emitter = Object.create(null) as ObsValueLike<any, ListenerParam>;

  emitter.canBeObservable = true;

  emitter.on = (id: any, listener: Listener<ListenerParam>) => innerEmitter.on(id, listener);
  emitter.off = (id, listener: Listener<ListenerParam>) => innerEmitter.off(id, listener);

  emitter.onChange = (listener: Listener<ListenerParam>) => innerEmitter.on('change', listener);
  emitter.offChange = (listener: Listener<ListenerParam>) => innerEmitter.off('change', listener);

  emitter.dispose = () => innerEmitter.dispose();

  Object.defineProperty(emitter, 'hasListeners', {
    get: () => innerEmitter.hasListeners,
  });

  emitter.numberOfListeners = () => innerEmitter.numberOfAllListeners();

  Object.defineProperty(emitter, 'numberOfIds', {
    get: () => innerEmitter.numberOfIds,
  });

  return {
    emitter: emitter as any,
    emitChange: (data: ListenerParam) => innerEmitter.emit('change', data),
  };
}
