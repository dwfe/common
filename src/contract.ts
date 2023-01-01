export interface IClassConstructor<T> extends Function { // the type describes the constructor of some class
  new(...args: any[]): T;
}

export interface IStoppable {
  stop(): void;
}

export type IRunMode = 'development' | 'test' | 'production';

export type IAnyObject = { [key: string]: any };
