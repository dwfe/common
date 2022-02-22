type Handler = (...args: any[]) => void;

/**
 * Node compatible EventEmitter
 */
export class NodeEventEmitter<TEvent = string> {
  private map = new Map<TEvent, Handler[]>();

  addListener(event: TEvent, handler: Handler): () => void {
    if (!this.hasHandlers(event))
      this.map.set(event, []);
    this.getHandlers(event).push(handler);
    return () => this.removeListener(event, handler);
  }

  removeListener(event: TEvent, handler: Handler) {
    if (!this.hasHandlers(event))
      return;
    const handlers = this.getHandlers(event).filter(x => x !== handler);
    if (handlers.length)
      this.map.set(event, handlers);
    else
      this.map.delete(event);
  }

  emit(event: TEvent, ...args: any[]) {
    if (!this.hasHandlers(event))
      return;
    this.getHandlers(event).forEach(handler => {
      handler(...args);
    });
  }

//region Support

  hasHandlers(event: TEvent): boolean {
    return this.map.has(event);
  }

  getHandlers(event: TEvent): Handler[] {
    return this.map.get(event) || [];
  }

//endregion

}
