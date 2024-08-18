import '@do-while-for-each/test'
import {isNullish} from '../../type';

describe(`isNullish`, () => {

  test(`check`, () => {
    expect(isNullish(null)).True();
    expect(isNullish(undefined)).True();

    expect(isNullish(false)).False();
    expect(isNullish(true)).False();
    expect(isNullish(0)).False();
    expect(isNullish(-0)).False();
    expect(isNullish(1)).False();
    expect(isNullish(7.43)).False();
    expect(isNullish(-7.43)).False();
    expect(isNullish(0n)).False();
    expect(isNullish(-0n)).False();
    expect(isNullish(12n)).False();
    expect(isNullish('')).False();
    expect(isNullish('0')).False();
    expect(isNullish('асыв')).False();
    expect(isNullish(Symbol('fer'))).False();
    expect(isNullish({})).False();
  });

});
