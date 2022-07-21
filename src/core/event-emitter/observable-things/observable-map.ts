import {EventEmitter} from '../event-emitter';

export type MapChangeEventListenerParam<K, V> = {
  key?: K, oldValue?: V, value?: V,
  type: 'add' | 'update' | 'delete' | 'clear'
};

export class ObservableMap<K, V>
  extends EventEmitter<{ change: MapChangeEventListenerParam<K, V> }>
  implements Map<K, V> {

  private readonly _map: Map<K, V>;

  readonly [Symbol.toStringTag] = 'ObservableMap';

  constructor(entries?: readonly (readonly [K, V])[] | null) {
    super();
    this._map = new Map(entries);
  }

  set(key: K, value: V): this {
    const oldValue = this._map.get(key);
    this._map.set(key, value);
    this.emitChange({
      key, oldValue, value,
      type: oldValue === undefined ? 'add' : 'update'
    });
    return this;
  }

  delete(key: K): boolean {
    const oldValue = this._map.get(key);
    if (oldValue === undefined) {
      return false;
    }
    this._map.delete(key);
    this.emitChange({key, oldValue, type: 'delete'});
    return true;
  }

  clear(): void {
    this._map.clear();
    this.emitChange({type: 'clear'});
  }


  get size(): number {
    return this._map.size;
  }

  has(key: K): boolean {
    return this._map.has(key);
  }

  get(key: K): V | undefined {
    return this._map.get(key);
  }


  keys(): IterableIterator<K> {
    return this._map.keys();
  }

  values(): IterableIterator<V> {
    return this._map.values();
  }

  entries(): IterableIterator<[K, V]> {
    return this._map.entries();
  }


  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
    this._map.forEach(callbackfn, thisArg);
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this._map[Symbol.iterator]();
  }


  emitChange(data: MapChangeEventListenerParam<K, V>) {
    this.emit('change', data)
  }

}
