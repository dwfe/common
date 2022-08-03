//@formatter:off

export type Listener<TData = any> = (data: TData) => void;

export interface IObsValueLike<EventIds,ListenerData> {
  on(id: EventIds, listener: Listener<ListenerData>): void;
  off(id: EventIds, listener: Listener<ListenerData>): void;
  dispose(): void;
  hasListeners(): boolean;
  numberOfIds(): number;
  numberOfListeners(): number;
}

export type ObsMapChangeEventListenerParam<K, V> = {
  key?: K, oldValue?: V, value?: V,
  type: 'add' | 'update' | 'delete' | 'clear'
};
export type IObsMap<K, V> = Map<K, V> & IObsValueLike<'change',ObsMapChangeEventListenerParam<K, V>>;


export type ObsArrayChangeEventListenerParam<T> = {
  type: 'add' | 'update' | 'delete' | 'clear';
  items: T[];
};
export type IObsArray<T = any> = Array<T> & IObsValueLike<'change',ObsArrayChangeEventListenerParam<T>>;
