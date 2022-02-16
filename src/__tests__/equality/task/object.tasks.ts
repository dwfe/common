import {DateTime, Duration} from 'luxon';
import {TTask} from './tasks';
import {IEqualityOpt} from '../../../core/type/contract'

export function objectTasks({sortArrays}: IEqualityOpt): TTask {
  const obj1 = {hello: '123', arr: [1, 'world', null]};
  const obj2 = {hello: '123', arr: [1, 'world', null]};
  const obj3 = {hello: '123', arr: ['world', null, 1]};

  const date1 = DateTime.now();
  const duration1 = Duration.fromObject({year: 2022, month: 2, day: 16});
  const obj4 = {hello: '123', date: date1, duration: duration1, arr: ['world', null, 1], set: new Set(['world', 7, undefined]), map: new Map([['hello', null], ['12', {}]])};
  const obj5 = {hello: '123', date: DateTime.fromISO(date1.toISO()), duration: Duration.fromISO(duration1.toISO()), arr: ['world', null, 1], set: new Set(['world', 7, undefined]), map: new Map([['hello', null], ['12', {}]])};

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