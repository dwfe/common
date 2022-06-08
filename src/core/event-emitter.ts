type Listener<TData = any> = (data?: TData) => void;

/**
 * Node compatible EventEmitter
 */
export class EventEmitter<TEvents extends { [id: string]: any; }> {

  private map = new Map<keyof TEvents, Set<Listener>>();


  on<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): () => void {
    return this.addListener(id, listener);
  }

  addListener<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): () => void {
    if (!this.hasId(id)) {
      this.map.set(id, new Set());
    }
    this.getListeners(id)!.add(listener);
    return () => this.removeListener(id, listener);
  }


  off<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): void {
    this.removeListener(id, listener);
  }

  removeListener<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): void {
    if (!this.hasId(id)) {
      return;
    }
    const remainingListeners = Array.from(this.getListeners(id)!).filter(x => x !== listener);
    if (remainingListeners.length)
      this.map.set(id, new Set(remainingListeners));
    else
      this.map.delete(id);
  }


  emit<TId extends keyof TEvents>(id: TId, data?: TEvents[TId]) {
    (this.getListeners(id) || []).forEach(listener => {
      listener(data);
    });
  }

  dispose(): void {
    for (const [id, listeners] of this.map) {
      for (const listener of listeners) {
        this.removeListener(id, listener);
      }
    }
  }


//region Support

  hasId<TId extends keyof TEvents>(id: TId): boolean {
    return this.map.has(id);
  }

  private getListeners<TId extends keyof TEvents>(id: TId): Set<Listener<TEvents[TId]>> | undefined {
    return this.map.get(id);
  }

  get size(): number {
    return this.map.size;
  }

//endregion Support

}
