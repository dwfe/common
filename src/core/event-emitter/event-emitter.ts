export type Listener<TData = any> = (data: TData) => void;

export class EventEmitter<TEvents extends { [id: string]: any; }> {

  private map = new Map<keyof TEvents, Set<Listener>>();

  emit<TId extends keyof TEvents>(id: TId, data?: TEvents[TId]) {
    const listeners = this.map.get(id);
    if (!listeners) {
      return;
    }
    for (const listener of listeners) {
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
      this.onFirstSubscribed(id);
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
  onFirstSubscribed<TId extends keyof TEvents>(id: TId): void {

  }

  onLastUnsubscribed(): void {

  }

  private handleUnobserved(): void {
    if (this.map.size === 0)
      this.onLastUnsubscribed();
  }


//region Support

  hasId<TId extends keyof TEvents>(id: TId): boolean {
    return this.map.has(id);
  }

  get numberOfIds(): number {
    return this.map.size;
  }

  numberOfListeners<TId extends keyof TEvents>(id: TId): number {
    const listeners = this.map.get(id)!;
    return listeners.size;
  }

  get hasListeners(): boolean {
    return this.map.size > 0;
  }

//endregion Support

}
