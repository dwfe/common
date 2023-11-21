export interface IClassConstructor<T> extends Function { // the type describes the constructor of some class
  new(...args: any[]): T;
}

export interface IStoppable {
  stop(): void;
}

export interface IDisposable {
  dispose(): void;
}

export type IRunMode = 'development' | 'test' | 'production';

export type IAnyObject<TValue = any> = { [key: string]: TValue };


export type ISuccess = true;
export type IFailure = false | undefined;
export type IResult = ISuccess | IFailure;

export const SUCCESS: ISuccess = true;
export const FAILURE: IFailure = false;
