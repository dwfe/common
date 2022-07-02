import {describe, expect} from '@jest/globals';
import {IEqualityCheckOpt, isEqual} from '../../index';
import {checks} from './checks';

const isDebug = false;

describe(`isEqual`, () => {

  test(`all strict`, () => runChecks());
  test(`all strict, sortArrays`, () => runChecks({sortArrays: true}));
  test(`isNullEqualsUndefined`, () => runChecks({isNullEqualsUndefined: true}));
  test(`isNullEqualsUndefined, sortArrays`, () => runChecks({isNullEqualsUndefined: true, sortArrays: true}));

});

function runChecks(opt?: IEqualityCheckOpt): void {
  for (const [a, b, expectedResult] of checks(opt)) {
    log(a, b, expectedResult);
    expect(isEqual(a, b, opt)).toBe(expectedResult);
  }
}

function log(a: any, b: any, expectedResult: boolean): void {
  if (isDebug)
    console.log('isEqual(', a, ',', b, `) expect ${expectedResult}`);
}
