import {TTask} from './tasks'
import {IOptions} from '../../../core/type/compare'

export function objectTasks({sortArrays}: IOptions): TTask {
  const obj1 = {hello: '123', arr: [1, 'world', null]};
  const obj2 = {hello: '123', arr: [1, 'world', null]};
  const obj3 = {hello: '123', arr: ['world', null, 1]};


  return [
    [obj2, obj1, true],
    [obj1, obj3, !!sortArrays],
    [{}, {}, true],
    [obj3, {}, false],
  ];
}
