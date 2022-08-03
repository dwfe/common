import {IObsArray, ObsArrayChangeEventListenerParam} from '../contract';
import {ProxyChangeEmitter} from './proxy.change-emitter';
import {EventEmitter} from '../event-emitter';

export function createObsArray<T = any>(init: T[] = []): IObsArray<T> {

  const emitter = new ProxyChangeEmitter<ObsArrayChangeEventListenerParam<T>>(
    new EventEmitter<{ change: any }>()
  );
  const emitChange = emitter.emitChange.bind(emitter);
  const emitterHasProp = emitter.hasProp.bind(emitter);

  return new Proxy<T[]>(init, {
    get(array, prop, receiver) {
      if (typeof prop === 'string' && !isNaN(prop as any)) {
        return array[prop as any];
      }
      switch (prop) {
        case 'length':
          return array.length;

        case 'push':
          return (...items: T[]): number => {
            const newLength = array.push.apply(array, items);
            emitChange({type: 'add', items});
            return newLength;
          };
      }
      if (emitterHasProp(prop)) {
        const value = (emitter as any)[prop];
        return typeof value === 'function' ? value.bind(emitter) : value
      }
      const value = Reflect.get(array, prop, receiver);
      return typeof value === 'function' ? value.bind(array) : value;
    },
  }) as IObsArray<T>;
}


// export class ObsArray<TValue> implements Array<TValue> {
//
//   length: number
//
//   [Symbol.iterator](): IterableIterator<TValue> {
//     return undefined;
//   }
//
//   [Symbol.unscopables](): {
//     copyWithin: boolean;
//     entries: boolean;
//     fill: boolean;
//     find: boolean;
//     findIndex: boolean;
//     keys: boolean;
//     values: boolean;
//   } {
//     return {copyWithin: false, entries: false, fill: false, find: false, findIndex: false, keys: false, values: false};
//   }
//
//   at(index: number): TValue | undefined {
//     return undefined;
//   }
//
//   concat(...items: ConcatArray<TValue>[]): TValue[]
//   concat(...items: (ConcatArray<TValue> | TValue)[]): TValue[]
//   concat(...items: (ConcatArray<TValue> | TValue)[]): TValue[] {
//     return [];
//   }
//
//   copyWithin(target: number, start: number, end?: number): this {
//     return undefined;
//   }
//
//   entries(): IterableIterator<[number, TValue]> {
//     return undefined;
//   }
//
//   every<S extends TValue>(predicate: (value: TValue, index: number, array: TValue[]) => value is S, thisArg?: any): this is S[]
//   every(predicate: (value: TValue, index: number, array: TValue[]) => unknown, thisArg?: any): boolean
//   every(predicate, thisArg?: any): any {
//   }
//
//   fill(value: TValue, start?: number, end?: number): this {
//     return undefined;
//   }
//
//   filter<S extends TValue>(predicate: (value: TValue, index: number, array: TValue[]) => value is S, thisArg?: any): S[]
//   filter(predicate: (value: TValue, index: number, array: TValue[]) => unknown, thisArg?: any): TValue[]
//   filter(predicate, thisArg?: any): any {
//   }
//
//   find<S extends TValue>(predicate: (this: void, value: TValue, index: number, obj: TValue[]) => value is S, thisArg?: any): S | undefined
//   find(predicate: (value: TValue, index: number, obj: TValue[]) => unknown, thisArg?: any): TValue | undefined
//   find(predicate, thisArg?: any): any {
//   }
//
//   findIndex(predicate: (value: TValue, index: number, obj: TValue[]) => unknown, thisArg?: any): number {
//     return 0;
//   }
//
//   flat<A, D extends number = 1>(depth?: D): FlatArray<A, D>[] {
//     return [];
//   }
//
//   flatMap<U, This = undefined>(callback: (this: This, value: TValue, index: number, array: TValue[]) => (ReadonlyArray<U> | U), thisArg?: This): U[] {
//     return [];
//   }
//
//   forEach(callbackfn: (value: TValue, index: number, array: TValue[]) => void, thisArg?: any): void {
//   }
//
//   includes(searchElement: TValue, fromIndex?: number): boolean {
//     return false;
//   }
//
//   indexOf(searchElement: TValue, fromIndex?: number): number {
//     return 0;
//   }
//
//   join(separator?: string): string {
//     return '';
//   }
//
//   keys(): IterableIterator<number> {
//     return undefined;
//   }
//
//   lastIndexOf(searchElement: TValue, fromIndex?: number): number {
//     return 0;
//   }
//
//   map<U>(callbackfn: (value: TValue, index: number, array: TValue[]) => U, thisArg?: any): U[] {
//     return [];
//   }
//
//   pop(): TValue | undefined {
//     return undefined;
//   }
//
//   push(...items: TValue[]): number {
//     return 0;
//   }
//
//   reduce(callbackfn: (previousValue: TValue, currentValue: TValue, currentIndex: number, array: TValue[]) => TValue): TValue
//   reduce(callbackfn: (previousValue: TValue, currentValue: TValue, currentIndex: number, array: TValue[]) => TValue, initialValue: TValue): TValue
//   reduce<U>(callbackfn: (previousValue: U, currentValue: TValue, currentIndex: number, array: TValue[]) => U, initialValue: U): U
//   reduce(callbackfn, initialValue?): any {
//   }
//
//   reduceRight(callbackfn: (previousValue: TValue, currentValue: TValue, currentIndex: number, array: TValue[]) => TValue): TValue
//   reduceRight(callbackfn: (previousValue: TValue, currentValue: TValue, currentIndex: number, array: TValue[]) => TValue, initialValue: TValue): TValue
//   reduceRight<U>(callbackfn: (previousValue: U, currentValue: TValue, currentIndex: number, array: TValue[]) => U, initialValue: U): U
//   reduceRight(callbackfn, initialValue?): any {
//   }
//
//   reverse(): TValue[] {
//     return [];
//   }
//
//   shift(): TValue | undefined {
//     return undefined;
//   }
//
//   slice(start?: number, end?: number): TValue[] {
//     return [];
//   }
//
//   some(predicate: (value: TValue, index: number, array: TValue[]) => unknown, thisArg?: any): boolean {
//     return false;
//   }
//
//   sort(compareFn?: (a: TValue, b: TValue) => number): this {
//     return undefined;
//   }
//
//   splice(start: number, deleteCount?: number): TValue[]
//   splice(start: number, deleteCount: number, ...items: TValue[]): TValue[]
//   splice(start: number, deleteCount?: number, ...items: TValue[]): TValue[] {
//     return [];
//   }
//
//   unshift(...items: TValue[]): number {
//     return 0;
//   }
//
//   values(): IterableIterator<TValue> {
//     return undefined;
//   }
//
//   [n: number]: TValue
//
// }
