import {noThrow, Throw} from '@do-while-for-each/test'
import {assert} from '../..'

describe('assert', () => {

  test('throw', () => {
    // @ts-ignore
    Throw(() => assert({} === {}), 'Assertion failed');
    Throw(() => assert(false, 'Samurai'), 'Samurai');
  });

  test('no throw', () => {
    noThrow(() => assert(true));
    noThrow(() => assert('hello'));
  });

});
