import {builtinEquals} from './check/builtinEquals';
import {IEqualityCheckOpt} from '../..';
import {object} from './check/object';
import {simple} from './check/simple';
import {array} from './check/array';
import {map} from './check/map';
import {set} from './check/set';

export type TChecks = Array<[any, any, boolean]>; // Array<[a, b, expectedResult]>

export function checks(opt: IEqualityCheckOpt = {}): TChecks {
  return [
    ...simple(opt),
    ...builtinEquals(),
    ...array(opt),
    ...set(),
    ...map(),
    ...object(opt),
  ];
}

