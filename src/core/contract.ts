export interface Type<T> extends Function { // the type describes the constructor of some class
  new(...args: any[]): T;
}

export interface IStoppable {
  stop(): void;
}

export type TRunMode = 'development' | 'test' | 'production';

export type TAnyObject = { [key: string]: any };
