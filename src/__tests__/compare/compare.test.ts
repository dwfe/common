import {describe, expect} from '@jest/globals'
import {IOptions} from '../../core/type/compare';
import {compare} from '../../core';
import {tasks} from './task/tasks';

describe(`compare`, () => {

  test(`sortArrays`, () => {
    const opt: IOptions = {sortArrays: true};
    for (const [a, b, check] of tasks(opt)) {
      log(a, b, check);
      expect(compare(a, b, opt)).toBe(check);
    }
  });

  test(`all strict`, () => {
    for (const [a, b, check] of tasks()) {
      log(a, b, check);
      expect(compare(a, b)).toBe(check);
    }
  });

  test(`nullEqualsUndefined`, () => {
    const opt: IOptions = {nullEqualsUndefined: true};
    for (const [a, b, check] of tasks(opt)) {
      log(a, b, check);
      expect(compare(a, b, opt)).toBe(check);
    }
  });



});

function log(a: any, b: any, check: boolean): void {
  console.log('compare(', a, b, `) expect ${check}`);
}
