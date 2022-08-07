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

export type ObsMapChangeEventListenerParam<K, V> =
  // Proxy.get
  { type: 'add'; key: K; value: V; } |
  { type: 'update'; key: K;  oldValue: V; value: V; } |
  { type: 'delete'; key: K;  value: V; } |
  { type: 'clear'; } |

  // Proxy.set
  { type: 'set-prop'; prop: string | symbol; value: any; } |

  // Proxy.deleteProperty
  { type: 'delete-prop'; prop: string | symbol; }
;
export type IObsMap<K, V> = Map<K, V> & ObsValueLike<'change', ObsMapChangeEventListenerParam<K, V>>;


export type ObsArrayChangeEventListenerParam<T> =
  // Proxy.get
  { type: 'copyWithin'; target: number, start: number, end?: number; } |
  { type: 'fill'; value: any; start: number; end?: number; }           |
  { type: 'pop'; value: T; }                                           |
  { type: 'push'; items: T[]; }                                        |
  { type: 'reverse'; }                                                 |
  { type: 'shift'; value: T; }                                         |
  { type: 'sort'; }                                                    |
  { type: 'splice'; deletedItems: T[]; start: number; deleteCount?: number; addedItems?: T[]; } |
  { type: 'unshift'; items: T[]; }                                     |

  // Proxy.set
  { type: 'set-by-index'; index: number; value: T;} |
  { type: 'set-length'; value: number; } |
  { type: 'set-prop'; prop: string | symbol; value: any; } |

  // Proxy.deleteProperty
  { type: 'delete-prop'; prop: string | symbol; }
;
export type IObsArray<T = any> = Array<T> & ObsValueLike<'change', ObsArrayChangeEventListenerParam<T>>;
