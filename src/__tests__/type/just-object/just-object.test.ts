import {describe} from '@jest/globals'
import {isJustObject, isNotJustObject} from '../../..';

//region Support

const data = [
  [undefined] as undefined[],
  [null] as null[],
  [true, false] as boolean[],
  [-Infinity, -9.35, -7, -0, 0, 1, 7, 9.35, Infinity, NaN] as number[],
  [-15n, 0n, 7n] as bigint[],
  ['hello', '-1', '0', '', '1'] as string[],
  [Symbol(), Symbol('id')] as symbol[],
  [() => 'world', function hello() {
  }] as Array<() => void>,
  [class A {
  }],
];

//endregion Support

describe('just object', () => {

  test('isJustObject', () => {
    for (const arr of data) {
      for (const value of arr) {
        expect(isJustObject(value)).toBe(false);
      }
    }
    expect(isJustObject({})).toBe(true);
    expect(isJustObject({hello: 123})).toBe(true);
  });

  test('isNotJustObject', () => {
    for (const arr of data) {
      for (const value of arr) {
        expect(isNotJustObject(value)).toBe(true);
      }
    }
    expect(isNotJustObject({})).toBe(false);
    expect(isNotJustObject({hello: 123})).toBe(false);
  });

});
