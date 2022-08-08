import {IObsObject, ObsObjectChangeEventListenerParam} from '../contract';
import {getProxyChangeEmitterHandlers} from './proxy.change-emitter';

export function createObsObject<T = any>(init: any = {}): IObsObject {
  const {emitChange, emitter} = getProxyChangeEmitterHandlers<ObsObjectChangeEventListenerParam>();
  return new Proxy<any>(init, {

    /**
     * Reading the Property value of the Target
     */
    get(obj, prop, receiver) {
      const emitterPropValue = emitter[prop];
      if (emitterPropValue !== undefined) {
        return emitterPropValue;
      }
      return Reflect.get(obj, prop, receiver);
    },

    /**
     * Writing the Value to the Property of the Target
     */
    set(obj, prop, value, receiver): boolean {
      const wasSet = Reflect.set(obj, prop, value, receiver);
      if (wasSet) {
        emitChange({type: 'set-prop', prop, value});
      }
      return wasSet;
    },

    /**
     * Deleting the Property of the Target
     */
    deleteProperty(obj, prop): boolean {
      const wasDeleted = Reflect.deleteProperty(obj, prop);
      if (wasDeleted) {
        emitChange({type: 'delete-prop', prop});
      }
      return wasDeleted;
    },

  }) as IObsObject;
}
