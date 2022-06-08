type Listener<TData = any> = (data: TData) => void;

/**
 * Node compatible EventEmitter
 */
export class NodeEventEmitter<TEvents extends { [id: string]: any; }> {

  private map = new Map<keyof TEvents, Listener[]>();


  addListener<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): () => void {
    if (!this.hasId(id)) {
      this.map.set(id, []);
    }
    this.getListeners(id)!.push(listener);
    return () => this.removeListener(id, listener);
  }

  on<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): () => void {
    return this.addListener(id, listener);
  }


  removeListener<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): void {
    if (!this.hasId(id)) {
      return;
    }
    const remainingListeners = this.getListeners(id)!.filter(x => x !== listener);
    if (remainingListeners.length)
      this.map.set(id, remainingListeners);
    else
      this.map.delete(id);
  }

  off<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): void {
    this.removeListener(id, listener);
  }


  emit<TId extends keyof TEvents>(id: TId, data: TEvents[TId]) {
    (this.getListeners(id) || []).forEach(listener => {
      listener(data);
    });
  }


//region Support

  hasId<TId extends keyof TEvents>(id: TId): boolean {
    return this.map.has(id);
  }

  private getListeners<TId extends keyof TEvents>(id: TId): Listener<TEvents[TId]>[] | undefined {
    return this.map.get(id);
  }

//endregion

}
