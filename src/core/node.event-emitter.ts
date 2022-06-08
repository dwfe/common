type Listener<TData = any> = (data: TData) => void;

/**
 * Node compatible EventEmitter
 */
export class NodeEventEmitter<TEvents extends { [id: string]: any; }> {

  private map = new Map<keyof TEvents, Listener[]>();

  addListener<TId extends keyof TEvents>(id: TId, listener: (data: TEvents[TId]) => void): () => void {
    if (!this.hasId(id)) {
      this.map.set(id, []);
    }
    this.getListeners(id).push(listener);
    return () => this.removeListener(id, listener);
  }

  removeListener<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>) {
    if (!this.hasId(id)) {
      return;
    }
    const listeners = this.getListeners(id).filter(x => x !== listener);
    if (listeners.length)
      this.map.set(id, listeners);
    else
      this.map.delete(id);
  }

  emit<TId extends keyof TEvents>(id: TId, data: TEvents[TId]) {
    this.getListeners(id).forEach(listener => {
      listener(data);
    });
  }


//region Support

  hasId<TId extends keyof TEvents>(name: TId): boolean {
    return this.map.has(name);
  }

  private getListeners<TId extends keyof TEvents>(name: TId): Listener<TEvents[TId]>[] {
    return this.map.get(name) || [];
  }

//endregion

}

const emitter = new NodeEventEmitter<{ change: string }>()
emitter.addListener('change', () => console.log(`dd`,))
