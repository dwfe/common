import '@do-while-for-each/test'
import {isPositiveNumber} from '../../type';

describe(`isPositiveNumber`, () => {

  test(`check`, () => {
    expect(isPositiveNumber(1)).True();
    expect(isPositiveNumber(1.1)).True();
    expect(isPositiveNumber(-1)).False();
    expect(isPositiveNumber('-1')).False();
    expect(isPositiveNumber('1')).False();
    expect(isPositiveNumber(0.000000001)).True();
    expect(isPositiveNumber(-0.000000001)).False();
    expect(isPositiveNumber(-0)).False();
    expect(isPositiveNumber(0)).False();
    expect(isPositiveNumber(Infinity)).False();
    expect(isPositiveNumber(-Infinity)).False();
    expect(isPositiveNumber(NaN)).False();
    expect(isPositiveNumber(undefined)).False();
    expect(isPositiveNumber(null)).False();
    expect(isPositiveNumber('as')).False();
  });

});
