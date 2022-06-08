type Listener<TData = any> = (data: TData) => void;

/**
 * Node compatible EventEmitter
 */
export class NodeEventEmitter<TEvents extends { [eventName: string]: any; }, TEventName extends keyof TEvents> {
  private map = new Map<TEventName, Listener[]>();

  addListener(event: TEventName, listener: Listener<TEvents[TEventName]>): () => void {
    if (!this.hasListeners(event)) {
      this.map.set(event, []);
    }
    this.getListeners(event).push(listener);
    return () => this.removeListener(event, listener);
  }

  removeListener(event: TEventName, listener: Listener<TEvents[TEventName]>) {
    if (!this.hasListeners(event)) {
      return;
    }
    const listeners = this.getListeners(event).filter(x => x !== listener);
    if (listeners.length)
      this.map.set(event, listeners);
    else
      this.map.delete(event);
  }

  emit(event: TEventName, data: TEvents[TEventName]) {
    if (!this.hasListeners(event)) {
      return;
    }
    this.getListeners(event).forEach(listener => {
      listener(data);
    });
  }

//region Support

  hasListeners(event: TEventName): boolean {
    return this.map.has(event);
  }

  getListeners(event: TEventName): Listener[] {
    return this.map.get(event) || [];
  }

//endregion

}
