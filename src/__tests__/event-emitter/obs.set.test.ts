import {checkSupport} from './util';
import {createObsSet} from '../..';

describe('methods that emit changes', () => {

  test('add', () => {
    const set = createObsSet();
    const onChange = jest.fn();

    set.on('change', onChange);
    expect(onChange).toBeCalledTimes(0);
    expect(set.size).eq(0);

    let result = set.add('hello');
    expect(result).eq(set);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'add', 'hello');
    expect(set.size).eq(1);

    result = set.add('hello');
    expect(result).eq(set);
    expect(onChange).toBeCalledTimes(1);
    expect(set.size).eq(1);

    result = set.add('world');
    expect(result).eq(set);
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'add', 'world');
    expect(set.size).eq(2);
  });

  test('delete', () => {
    const set = createObsSet([1, 2, 3]);
    const onChange = jest.fn();

    set.on('change', onChange);
    expect(onChange).toBeCalledTimes(0);
    expect(set.size).eq(3);

    let result = set.delete(4);
    expect(result).False();
    expect(onChange).toBeCalledTimes(0);
    expect(set.size).eq(3);

    result = set.delete(2);
    expect(result).True();
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'delete', 2);
    expect(set.size).eq(2);

    result = set.delete(1);
    expect(result).True();
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'delete', 1);
    expect(set.size).eq(1);

    result = set.delete(3);
    expect(result).True();
    expect(onChange).toBeCalledTimes(3);
    lastFnResult(onChange, 'delete', 3);
    expect(set.size).eq(0);

    result = set.delete(3);
    expect(result).False();
    expect(onChange).toBeCalledTimes(3);
    expect(set.size).eq(0);
  });

  test('clear', () => {
    {
      const set = createObsSet([1, 2, 3]);
      const onChange = jest.fn();

      set.on('change', onChange);
      expect(onChange).toBeCalledTimes(0);
      expect(set.size).eq(3);

      set.clear();
      expect(onChange).toBeCalledTimes(1);
      lastFnResult(onChange, 'clear');
      expect(set.size).eq(0);

      set.clear();
      expect(onChange).toBeCalledTimes(1);
      expect(set.size).eq(0);
    }
    {
      const set = createObsSet();
      const onChange = jest.fn();

      set.on('change', onChange);
      expect(onChange).toBeCalledTimes(0);
      expect(set.size).eq(0);

      set.clear();
      expect(onChange).toBeCalledTimes(0);
      expect(set.size).eq(0);

      set.clear();
      expect(onChange).toBeCalledTimes(0);
      expect(set.size).eq(0);
    }
  });

  test('set-prop / delete-prop', () => {
    const set = createObsSet();
    const onChange = jest.fn();

    set.on('change', onChange);
    expect(set.size).eq(0);
    expect(onChange).toBeCalledTimes(0);

    expect(set).not.toHaveProperty('hello');
    let result = (set['hello'] = 'world');
    expect(result).eq('world');
    expect(set.size).eq(0);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'set-prop', 'hello', 'world');
    expect(set).toHaveProperty('hello', 'world');

    delete set['hello'];
    expect(set.size).eq(0);
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'delete-prop', 'hello');
    expect(set).not.toHaveProperty('hello');
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
    expect(Array.from(createObsSet().keys()).length).eq(0);
    const arr = Array.from(createObsSet([1, 2, 3]).keys());
    expect(arr.length).eq(3);
    expect(arr[0]).eq(1);
    expect(arr[1]).eq(2);
    expect(arr[2]).eq(3);
  });

  test('values', () => {
    expect(Array.from(createObsSet().values()).length).eq(0);
    const arr = Array.from(createObsSet([1, 2, 3]).values());
    expect(arr.length).eq(3);
    expect(arr[0]).eq(1);
    expect(arr[1]).eq(2);
    expect(arr[2]).eq(3);
  });

  test('entries', () => {
    expect(Array.from(createObsSet().entries()).length).eq(0);
    const arr = Array.from(createObsSet([1, 2, 3]).entries());
    expect(arr.length).eq(3);
    expect(arr[0][0]).eq(1);
    expect(arr[0][1]).eq(1);
    expect(arr[1][0]).eq(2);
    expect(arr[1][1]).eq(2);
    expect(arr[2][0]).eq(3);
    expect(arr[2][1]).eq(3);
  });

  test('forEach', () => {
    createObsSet().forEach(() => {
      throw new Error('empty set forEach');
    });
    const arr: any[] = [];
    createObsSet([1, 2, 3]).forEach((value, value2) => {
      arr.push([value, value2]);
    });
    expect(arr.length).eq(3);
    expect(arr[0][0]).eq(1);
    expect(arr[0][1]).eq(1);
    expect(arr[1][0]).eq(2);
    expect(arr[1][1]).eq(2);
    expect(arr[2][0]).eq(3);
    expect(arr[2][1]).eq(3);
  });

  test('iterator', () => {
    for (const value of createObsSet()) {
      throw new Error('empty map iterator');
    }
    const arr: any[] = [];
    for (const value of createObsSet([1, 2, 3])) {
      arr.push(value);
    }
    expect(arr.length).eq(3);
    expect(arr[0]).eq(1);
    expect(arr[1]).eq(2);
    expect(arr[2]).eq(3);
  });

});

describe('creating', () => {

  test('no arguments', () => {
    const set = createObsSet();
    expect(set.size).eq(0);
  });

  test('T[]', () => {
    const set = createObsSet([1, 2, 3]);
    expect(set.size).eq(3);
  });

  test('Set<T>', () => {
    const set = createObsSet(new Set([1, 'hello']));
    expect(set.size).eq(2);
  });

  test('clone Array', () => {
    const source = [1, 'hello'];
    const set = createObsSet(source);
    expect(set.size).eq(2);
    expect(source.length).eq(2);

    source.length = 0;
    expect(set.size).eq(2);
    expect(source.length).eq(0);
  });

  test('clone Set', () => {
    const source = new Set([1, 'hello']);
    const set = createObsSet(source);
    expect(set.size).eq(2);
    expect(source.size).eq(2);

    source.clear();
    expect(set.size).eq(2);
    expect(source.size).eq(0);
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

function lastFnResult(fn: ReturnType<typeof jest.fn>, type, ...rest: any[]) {
  const last = fn.mock.lastCall[0];
  expect(type).eq(last.type);
  switch (type) {
    case 'add': {
      const [value] = rest;
      expect(last.value).eq(value);
      break;
    }
    case 'delete': {
      const [value] = rest;
      expect(last.value).eq(value);
      break;
    }
    case 'set-prop': {
      const [prop, value] = rest;
      expect(last.prop).eq(prop);
      expect(last.value).eq(value);
      break;
    }
    case 'delete-prop': {
      const [prop] = rest;
      expect(last.prop).eq(prop);
      break;
    }
  }
}
