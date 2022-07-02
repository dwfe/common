import {SomeHasEquals} from './builtinEquals'
import {IEqualityCheckOpt} from '../../../index';
import {TChecks} from '../checks';

export function object({sortArrays}: IEqualityCheckOpt): TChecks {
  const obj1 = {hello: '123', arr: [1, 'world', null]};
  const obj2 = {hello: '123', arr: [1, 'world', null]};
  const obj3 = {hello: '123', arr: ['world', null, 1]};

  const obj4 = {hello: '123', some: new SomeHasEquals('Elvis'), arr: ['world', null, 1], set: new Set(['world', 7, undefined]), map: new Map([['hello', null], ['12', {}]])};
  const obj5 = {hello: '123', some: new SomeHasEquals('Elvis'), arr: ['world', null, 1], set: new Set(['world', 7, undefined]), map: new Map([['hello', null], ['12', {}]])};

  return [
    [obj2, obj1, true],
    [obj1, obj3, !!sortArrays],
    [{}, {}, true],
    [obj3, {}, false],
    [obj3, null, false],
    [undefined, obj3, false],
    [obj4, obj5, true],
    [obj5, obj4, true],
  ];
}
