import {IObsObject, ObsObjectChangeEventListenerParam} from '../contract';
import {getProxyChangeEmitter} from './proxy.change-emitter';

export function createObsObject<T = any>(init: T = {} as T): IObsObject & T {
  const {emitter, emitChange} = getProxyChangeEmitter<ObsObjectChangeEventListenerParam>();
  return new Proxy<any>({...init}, {

    /**
     * Reading the Property value of the Target
     */
    get(obj, prop, receiver) {
      switch (prop) {
        case 'toString':
          return () => '[object ObsObject]';
      }
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

    // /**
    //  * Defining the Property of the Target
    //  */
    // defineProperty(obj, prop, descriptor): boolean {
    //   const wasDefined = Reflect.defineProperty(obj, prop, descriptor);
    //   if (wasDefined) {
    //     emitChange({type: 'define-prop', prop, descriptor});
    //   }
    //   return wasDefined;
    // }
  }) as IObsObject & T;
}
