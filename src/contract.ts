export interface IClassConstructor<T> extends Function { // the type describes the constructor of some class
  new(...args: any[]): T;
}

export interface IIdentifiable {
  id: number
}

export interface ICloneable<T = any> {
  clone(): T;
}

export interface IStoppable {
  stop(): void;
}

export interface IDisposable {
  dispose(): void;
}

export interface INamed {
  nameRu: string,
  nameEn: string,
}

export interface IRepresentable {
  representation: string;
  representationRu: string;
  representationEn: string;
}


export type IRunMode = 'development' | 'test' | 'production';

export type IAnyObject<TValue = any> = { [key: string]: TValue };

// Вычисляет тип поля объекта
export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];


export type ISuccess = true;
export type IFailure = false | undefined;
export type IResult = ISuccess | IFailure;

export const SUCCESS: ISuccess = true;
export const FAILURE: IFailure = false;

/**
 * Не пустой массив Т
 */
export type INonEmptyArray<T = any> = [T, ...T[]]

/**
 * Вспомогательный тип для массива фиксированной длины
 */
type IFixedArrayHandleType<TItem extends any, TLength extends number, TArray extends Array<TItem>> = TArray['length'] extends TLength ? TArray : IFixedArrayHandleType<TItem, TLength, [TItem, ...TArray]>

/**
 * Массив фиксированной длины
 *
 * @param TLength длина массива - строго число
 * @param TItem массив этих типов
 */
export type IFixedLengthArray<TLength extends number, TItem extends any = any> =
// в качестве TLength передан number
  number extends TLength ? never :
    // в качестве TLength передано число
    TLength extends number ? IFixedArrayHandleType<TItem, TLength, [TItem]> :
      // в качестве TLength передано не число
      never
