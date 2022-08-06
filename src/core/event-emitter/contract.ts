//@formatter:off

export type Listener<TData = any> = (data: TData) => void;

/**
 * Value that can be observable.
 */
export interface ObsValueLike<EventIds = any, ListenerData = any> {
  canBeObservable: boolean;
  on(id: EventIds, listener: Listener<ListenerData>): void;
  off(id: EventIds, listener: Listener<ListenerData>): void;
  dispose(): void;
//region Support
  hasListeners: boolean;
  numberOfListeners(id?: any): number;
  numberOfIds: number;
//endregion Support
}

export type ObsMapChangeEventListenerParam<K, V> = {
  key?: K, oldValue?: V, value?: V,
  type: 'add' | 'update' | 'delete' | 'clear'
};
export type IObsMap<K, V> = Map<K, V> & ObsValueLike<'change', ObsMapChangeEventListenerParam<K, V>>;


export type ObsArrayChangeEventListenerParam<T> =
  // Proxy.get
  { type: 'copyWithin'; target: number, start: number, end?: number } |
  { type: 'fill'; value: any; start: number; end?: number } |
  { type: 'pop'; value: T; }    |
  { type: 'push'; items: T[]; } |

  // Proxy.set
  { type: 'set-by-index'; index: number; value: T;} |
  { type: 'set-length'; value: number; }
;

/*

  type:
    'copyWithin' | 'fill' | 'pop' | 'push' | 'reverse' | 'shift' | 'sort' | 'splice' | 'unshift' | // Proxy.get
    'set-by-index' | 'clear-by-length-0'                                                           // Proxy.set
  ;

 */

export type IObsArray<T = any> = Array<T> & ObsValueLike<'change', ObsArrayChangeEventListenerParam<T>>;
