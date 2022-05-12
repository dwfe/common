import {TChecks} from '../checks';

export function builtinEquals(): TChecks {

  return [
    [new SomeHasEquals('Amos'), new SomeHasEquals('Amos'), true],
    [new SomeHasEquals('Amos'), new SomeHasEquals('John'), false],
    [new SomeHasEquals('John'), new SomeHasEquals('Amos'), false],
  ];
}

export class SomeHasEquals {
  constructor(public name: string) {
  }

  equals(other: SomeHasEquals): boolean {
    return this.name === other.name;
  }
}
