type Listener<TData = any> = (data?: TData) => void;

export class EventEmitter<TEvents extends { [id: string]: any; }> {

  private map = new Map<keyof TEvents, Set<Listener>>();

  emit<TId extends keyof TEvents>(id: TId, data?: TEvents[TId]) {
    for (const listener of this.map.get(id)!) {
      listener(data);
    }
  }


  on<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): () => void {
    return this.addEventListener(id, listener);
  }

  addEventListener<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): () => void {
    let listeners = this.map.get(id);
    if (!listeners) {
      listeners = new Set();
      this.map.set(id, listeners);
    }
    listeners.add(listener);
    if (this.map.size === 1 && listeners.size === 1) {
      this.onFirstSubscribe(id);
    }
    return () => this.removeEventListener(id, listener);
  }


  off<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): void {
    this.removeEventListener(id, listener);
  }

  removeEventListener<TId extends keyof TEvents>(id: TId, listener: Listener<TEvents[TId]>): void {
    const listeners = this.map.get(id)!;
    listeners.delete(listener);
    if (listeners.size === 0) {
      this.map.delete(id);
    }
    this.handleUnobserved();
  }


  dispose(): void {
    if (this.map.size === 0) {
      return;
    }
    for (const listeners of this.map.values()) {
      listeners.clear();
    }
    this.map.clear();
    this.handleUnobserved();
  }


  // @ts-ignore
  protected onFirstSubscribe<TId extends keyof TEvents>(id: TId): void {

  }

  protected onUnobserved(): void {

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

  get size(): number {
    return this.map.size;
  }

//endregion Support

}
