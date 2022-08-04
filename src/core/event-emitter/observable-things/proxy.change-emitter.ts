import {Listener, ObsValueLike} from '../contract';
import {EventEmitter} from '../event-emitter';

/**
 * A wrapper over the EventEmitter that limits the functionality of the EventEmitter to event "change" only.
 */
interface ProxyChangeEmitter<ListenerParam = any> extends ObsValueLike<any, ListenerParam> {
  emitChange(data: ListenerParam): void;
}

export function getProxyChangeEmitterHandlers<ListenerParam = any>() {
  const eventEmitter = new EventEmitter<{ change: any }>();
  const emitter = Object.create(null) as ProxyChangeEmitter<ListenerParam>;

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
  emitter.canBeObservable = true;

  return {
    emitChange: (data: ListenerParam) => eventEmitter.emit('change', data),
    emitter: emitter as any,
  };
}
