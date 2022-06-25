type Listener<TData = any> = (data?: TData) => void;

/**
 * Node compatible EventEmitter
 */
export class EventEmitter<TEvents extends { [id: string]: any; }> {

  private map = new Map<keyof TEvents, Set<Listener>>();


  on<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): () => void {
    return this.addEventListener(id, listener);
  }

  addEventListener<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): () => void {
    if (!this.hasId(id)) {
      this.map.set(id, new Set());
    }
    const listeners = this.getListeners(id)!;
    listeners.add(listener)
    if (this.map.size === 1 && listeners.size === 1) {
      this.onFirstSubscribe(id);
    }
    return () => this.removeEventListener(id, listener);
  }


  off<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): void {
    this.removeEventListener(id, listener);
  }

  removeEventListener<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): void {
    if (!this.hasId(id)) {
      return;
    }
    const listeners = this.getListeners(id)!;
    listeners.delete(listener);
    if (listeners.size === 0) {
      this.map.delete(id);
    }
    this.handleUnobserved();
  }


  emit<TId extends keyof TEvents>(id: TId, data?: TEvents[TId]) {
    for (const listener of (this.getListeners(id) || [])) {
      listener(data);
    }
  }

  dispose(): void {
    for (const listeners of this.map.values()) {
      listeners.clear();
    }
    this.map.clear();
    this.handleUnobserved();
  }


  // @ts-ignore
  onFirstSubscribe<TId extends keyof TEvents>(id: TId): void {

  }

  onUnobserved(): void {

  }

  handleUnobserved(): void {
    if (this.map.size === 0) {
      this.onUnobserved();
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
