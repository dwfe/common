import {describe, expect} from '@jest/globals'
import * as console2 from 'console';
import {IEqualityCheckOpt, isEqual} from '../..';
import {checks} from './checks';

global.console = console2;

describe(`isEqual`, () => {

  test(`sortArrays`, () => runChecks({sortArrays: true}));
  test(`all strict`, () => runChecks());
  test(`nullEqualsUndefined`, () => runChecks({nullEqualsUndefined: true}));

});

function runChecks(opt?: IEqualityCheckOpt): void {
  for (const [a, b, expectedResult] of checks(opt)) {
    log(a, b, expectedResult);
    expect(isEqual(a, b, opt)).toBe(expectedResult);
  }
}

function log(a: any, b: any, expectedResult: boolean): void {
  console.log('isEqual(', a, ',', b, `) expect ${expectedResult}`);
}
