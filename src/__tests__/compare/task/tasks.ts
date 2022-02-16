import {IOptions} from '../../../core/type/compare';
import {getSimpleTasks} from './simple.tasks';
import {getArrayTasks} from './array.tasks';
import {getSetTasks} from './set.tasks';
import {getMapTasks} from './map.tasks';

export type TTask = Array<[any, any, boolean]>; // [a, b, check]

export function tasks(opt: IOptions = {}) {
  return [
    ...getSimpleTasks(opt),
    ...getArrayTasks(opt),
    ...getSetTasks(),
    ...getMapTasks(),
  ];
}

