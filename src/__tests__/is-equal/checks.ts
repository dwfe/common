import {IEqualityCheckOpt} from '../..';
import {object} from './check/object';
import {simple} from './check/simple';
import {array} from './check/array';
import {luxon} from './check/luxon';
import {map} from './check/map';
import {set} from './check/set';

export type TChecks = Array<[any, any, boolean]>; // Array<[a, b, expectedResult]>

export function checks(opt: IEqualityCheckOpt = {}): TChecks {
  return [
    ...simple(opt),
    ...luxon(),
    ...array(opt),
    ...set(),
    ...map(),
    ...object(opt),
  ];
}

