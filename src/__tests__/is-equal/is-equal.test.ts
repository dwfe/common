import {describe, expect} from '@jest/globals'
import * as console2 from 'console';
import {IEqualityCheckOpt, isEqual} from '../..';
import {checks} from './checks';

beforeEach(() => {
  global.console = console2;
});

describe(`isEqual`, () => {

  test(`sortArrays`, () => {
    runTasks({sortArrays: true});
  });

  test(`all strict`, () => {
    runTasks();
  });

  test(`nullEqualsUndefined`, () => {
    runTasks({nullEqualsUndefined: true});
  });

});

function runTasks(opt?: IEqualityCheckOpt): void {
  for (const [a, b, expectedResult] of checks(opt)) {
    log(a, b, expectedResult);
    expect(isEqual(a, b, opt)).toBe(expectedResult);
  }
}

function log(a: any, b: any, expectedResult: boolean): void {
  console.log('isEqual(', a, ',', b, `) expect ${expectedResult}`);
}
