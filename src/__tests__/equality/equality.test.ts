import {describe, expect} from '@jest/globals'
import * as console2 from 'console';
import {equality, IEqualityOpt} from '../..';
import {tasks} from './task/tasks';

beforeEach(() => {
  global.console = console2;
});

describe(`equality`, () => {

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

function runTasks(opt?: IEqualityOpt): void {
  for (const [a, b, check] of tasks(opt)) {
    log(a, b, check);
    expect(equality(a, b, opt)).toBe(check);
  }
}

function log(a: any, b: any, check: boolean): void {
  console.log('equality(', a, ',', b, `) expect ${check}`);
}
