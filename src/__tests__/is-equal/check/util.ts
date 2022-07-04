import {traversEachWithEachAllJSDataTypes} from '@do-while-for-each/test';
import {IEqualityCheckOpt} from '../../../index';
import {TChecks} from '../checks';

export function simple({isNullEqualsUndefined}: IEqualityCheckOpt): TChecks {
  const result: TChecks = [];

  traversEachWithEachAllJSDataTypes((a, b) => {
    let expectedResult = Object.is(a, b);
    if (isNullEqualsUndefined && isBothNullOrUndefined(a, b))
      expectedResult = a == b;
    result.push([a, b, expectedResult]);
  });

  return result;
}

function isBothNullOrUndefined(a: any, b: any): boolean {
  return a == null && b == null;
}
