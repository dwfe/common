import {ObsValueLike, Listener} from '../contract';
import {EventEmitter} from '../event-emitter';

export class ProxyChangeEmitter<ListenerData> implements ObsValueLike {

  constructor(private eventEmitter: EventEmitter<any>) {
  }

  hasProp(prop: string | symbol): boolean {
    switch (prop) {
      case 'canBeObservable':
      case 'on':
      case 'off':
      case 'dispose':
      case 'hasListeners':
      case 'numberOfListeners':
      case 'numberOfIds':
        return true;
    }
    return false;
  }

  on(id: 'change', listener: Listener<ListenerData>): void {
    this.eventEmitter.on(id as any, listener);
  }

  off(id: 'change', listener: Listener<ListenerData>): void {
    this.eventEmitter.off(id as any, listener);
  }

  dispose(): void {
    this.eventEmitter.dispose();
  }

  emitChange(data: ListenerData): void {
    this.eventEmitter.emit('change', data);
  }


//region Support

  get hasListeners(): boolean {
    return this.eventEmitter.hasListeners;
  }

  numberOfListeners(): number {
    return this.eventEmitter.numberOfListeners('change');
  }

  get numberOfIds(): number {
    return this.eventEmitter.numberOfIds;
  }

  canBeObservable = true;

//endregion Support

}
