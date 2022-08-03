import {Listener, ObsValueLike} from '../contract';
import {EventEmitter} from '../event-emitter';

/**
 * A wrapper over the EventEmitter that limits the functionality of the EventEmitter to event "change" only.
 */
interface ProxyChangeEmitter extends ObsValueLike {
  emitChange(data: any): void;
}

export function getProxyChangeEmitterHandlers() {
  const eventEmitter = new EventEmitter<{ change: any }>();
  const emitter = Object.create(null) as ProxyChangeEmitter;

  emitter.on = (id: any, listener: Listener) => eventEmitter.on(id, listener);
  emitter.off = (id, listener: Listener) => eventEmitter.off(id, listener);
  emitter.dispose = () => eventEmitter.dispose();
  emitter.emitChange = (data: any) => eventEmitter.emit('change', data);
  Object.defineProperty(emitter, 'hasListeners', {
    get: () => eventEmitter.hasListeners,
  });
  emitter.numberOfListeners = () => eventEmitter.numberOfListeners('change');
  Object.defineProperty(emitter, 'numberOfIds', {
    get: () => eventEmitter.numberOfIds,
  });
  emitter.canBeObservable = true;

  return {
    emitChange: emitter.emitChange,
    emitter: emitter as any,
  };
}
