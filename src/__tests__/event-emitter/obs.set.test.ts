import {checkSupport} from './util';
import {createObsSet} from '../..';

describe('methods that emit changes', () => {

  test('add', () => {

  });

  test('delete', () => {

  });

  test('clear', () => {

  });

  test('set-prop / delete-prop', () => {

  });

});

describe('methods that do not emit changes', () => {

  test('toString', () => {
    expect(createObsSet().toString()).eq('[object ObsSet]');
    expect(createObsSet([1, 2, 'hello']).toString()).eq('[object ObsSet]');
  });

  test('size', () => {
    expect(createObsSet().size).eq(0);
    expect(createObsSet([1, 2, 'hello']).size).eq(3);
  });

  test('keys', () => {

  });

  test('values', () => {

  });

  test('entries', () => {

  });

  test('forEach', () => {

  });

  test('iterator', () => {

  });

});

describe('creating', () => {

  test('no arguments', () => {
    const set = createObsSet();
    expect(set.size).eq(0);
  });

  test('T[]', () => {

  });

  test('Set<T>', () => {

  });

  test('clone Set', () => {

  });

  test('clone Array', () => {

  });

});

describe('ObsValueLike', () => {

  test('canBeObservable', () => {
    expect(createObsSet()).toHaveProperty('canBeObservable', true);
    expect(createObsSet([1, 2, 3])).toHaveProperty('canBeObservable', true);
  });

  test('on/off "change"', () => {
    const set = createObsSet([1, 2, 3]);
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();
    checkSupport(set, 0, false);

    set.on('change', onChange1);
    checkSupport(set, 1, true, 1);

    set.on('change', onChange1);
    checkSupport(set, 1, true, 1);

    set.off('change', onChange1);
    checkSupport(set, 0, false);

    set.on('change', onChange2);
    checkSupport(set, 1, true, 1);

    set.on('change', onChange1);
    checkSupport(set, 1, true, 2);

    set.off('change', onChange1);
    checkSupport(set, 1, true, 1);

    set.off('change', onChange2);
    checkSupport(set, 0, false);

    expect(onChange1).toBeCalledTimes(0);
    expect(onChange2).toBeCalledTimes(0);
  });

  test('dispose', () => {
    const set = createObsSet();
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();
    checkSupport(set, 0, false);

    set.on('change', onChange2);
    checkSupport(set, 1, true, 1);

    set.dispose();
    checkSupport(set, 0, false);

    set.on('change', onChange1);
    checkSupport(set, 1, true, 1);

    set.on('change', onChange2);
    checkSupport(set, 1, true, 2);

    set.dispose();
    checkSupport(set, 0, false);
  });

});
