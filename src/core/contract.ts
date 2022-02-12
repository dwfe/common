export interface Type<T> extends Function { // the type describes the constructor of some class
  new(...args: any[]): T;
}

export interface IStoppable {
  stop(): void;
}
