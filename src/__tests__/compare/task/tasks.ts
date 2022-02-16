import {IOptions} from '../../../core/type/compare';
import {objectTasks} from './object.tasks';
import {simpleTasks} from './simple.tasks';
import {arrayTasks} from './array.tasks';
import {luxonTasks} from './luxon.tasks';
import {mapTasks} from './map.tasks';
import {setTasks} from './set.tasks';

export type TTask = Array<[any, any, boolean]>; // [a, b, check]

export function tasks(opt: IOptions = {}) {
  return [
    ...simpleTasks(opt),
    ...luxonTasks(),
    ...arrayTasks(opt),
    ...setTasks(),
    ...mapTasks(),
    ...objectTasks(opt),
  ];
}

