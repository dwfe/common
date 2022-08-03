import {Throw} from '@do-while-for-each/test';
import {createObsMap} from '../..';

const initData = [['hello', 2], ['world', null]] as any;

const mapEmpty = createObsMap();
const map2Keys = createObsMap(initData);

export function lastFnResult(fn: ReturnType<typeof jest.fn>, type, key, oldValue, value) {
  const last = fn.mock.lastCall[0];
  expect(type).eq(last.type);
  expect(key).eq(last.key);
  expect(oldValue).eq(last.oldValue);
  expect(value).eq(last.value);
}

describe('observable-map. #1', () => {

  test('toStringTag', () => {
    expect(mapEmpty.toString()).eq('[object ObsMap]');
    expect(map2Keys.toString()).eq('[object ObsMap]');
  });

  test('size', () => {
    expect(mapEmpty.size).eq(0);
    expect(map2Keys.size).eq(2);
  });

  test('has', () => {
    expect(map2Keys.has('ok')).False();
    expect(map2Keys.has('world')).True();
    expect(map2Keys.has({})).False();
  });

  test('get', () => {
    expect(mapEmpty.get('hello')).eq(undefined);
    expect(map2Keys.get('hello')).eq(2);
    expect(map2Keys.get('kl')).eq(undefined);
  });

  test('keys', () => {
    expect(Array.from(mapEmpty.keys()).length).eq(0);
    const arr = Array.from(map2Keys.keys());
    expect(arr.length).eq(2);
    expect(arr[0]).eq('hello');
    expect(arr[1]).eq('world');
  });

  test('values', () => {
    expect(Array.from(mapEmpty.values()).length).eq(0);
    const arr = Array.from(map2Keys.values());
    expect(arr.length).eq(2);
    expect(arr[0]).eq(2);
    expect(arr[1]).eq(null);
  });

  test('entries', () => {
    expect(Array.from(mapEmpty.entries()).length).eq(0);
    const arr = Array.from(map2Keys.entries());
    expect(arr.length).eq(2);
    expect(arr[0][0]).eq('hello');
    expect(arr[0][1]).eq(2);
    expect(arr[1][0]).eq('world');
    expect(arr[1][1]).eq(null);
  });

  test('forEach', () => {
    mapEmpty.forEach(() => {
      throw new Error('empty map forEach');
    });
    map2Keys.forEach((value, key) => {
      expect(map2Keys.get(key)).eq(value)
    });
  });

  test('iterator', () => {
    for (const [key, value] of mapEmpty) {
      throw new Error('empty map iterator');
    }
    for (const [key, value] of map2Keys) {
      expect(map2Keys.get(key)).eq(value);
    }
  });

  test('on/off "change"', () => {
    const map = createObsMap();
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();

    expect(map.hasListeners()).False();

    map.on('change', onChange1);
    expect(map.hasListeners()).True();
    expect(map.numberOfIds()).eq(1);
    expect(map.numberOfListeners()).eq(1);

    map.on('change', onChange1);
    expect(map.numberOfIds()).eq(1);
    expect(map.numberOfListeners()).eq(1);

    map.off('change', onChange1);
    expect(map.hasListeners()).False();
    expect(map.numberOfIds()).eq(0);

    map.on('change', onChange2);
    expect(map.numberOfIds()).eq(1);
    expect(map.numberOfListeners()).eq(1);

    map.on('change', onChange1);
    expect(map.numberOfIds()).eq(1);
    expect(map.numberOfListeners()).eq(2);

    map.off('change', onChange1);
    expect(map.hasListeners()).True();
    expect(map.numberOfIds()).eq(1);
    expect(map.numberOfListeners()).eq(1);

    map.off('change', onChange2);
    expect(map.hasListeners()).False();
    expect(map.numberOfIds()).eq(0);
    Throw(() => map.numberOfListeners(), `Cannot read properties of undefined (reading 'size')`);
  });

  test('dispose', () => {
    const map = createObsMap();
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();

    map.on('change', onChange2);
    expect(map.numberOfIds()).eq(1);
    expect(map.numberOfListeners()).eq(1);

    map.dispose();
    expect(map.numberOfIds()).eq(0);
    Throw(() => map.numberOfListeners(), `Cannot read properties of undefined (reading 'size')`);

    map.on('change', onChange1);
    expect(map.hasListeners()).True();
    expect(map.numberOfIds()).eq(1);
    expect(map.numberOfListeners()).eq(1);

    map.on('change', onChange2);
    expect(map.numberOfIds()).eq(1);
    expect(map.numberOfListeners()).eq(2);

    map.dispose();
    expect(map.numberOfIds()).eq(0);
    Throw(() => map.numberOfListeners(), `Cannot read properties of undefined (reading 'size')`);
  });

});

describe('observable-map. #2', () => {

  test('set', () => {
    const map = createObsMap();
    const onChange = jest.fn();

    map.on('change', onChange);
    expect(onChange).toBeCalledTimes(0);
    expect(map.size).eq(0);

    map.set('hello', 'Alex');
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'add', 'hello', undefined, 'Alex');
    expect(map.size).eq(1);

    map.set('hello', 'Alex');
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'update', 'hello', 'Alex', 'Alex');
    expect(map.size).eq(1);

    map.set('hello', 17);
    expect(onChange).toBeCalledTimes(3);
    lastFnResult(onChange, 'update', 'hello', 'Alex', 17);
    expect(map.size).eq(1);

    map.set('world', true);
    expect(onChange).toBeCalledTimes(4);
    lastFnResult(onChange, 'add', 'world', undefined, true);
    expect(map.size).eq(2);
  });

  test('delete', () => {
    const map = createObsMap(initData);
    const onChange = jest.fn();

    map.on('change', onChange);
    expect(onChange).toBeCalledTimes(0);
    expect(map.size).eq(2);

    map.delete('say');
    expect(onChange).toBeCalledTimes(0);
    expect(map.size).eq(2);

    map.delete('world');
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'delete', 'world', null, undefined);
    expect(map.size).eq(1);
  });

  test('clear', () => {
    {
      const map = createObsMap();
      const onChange = jest.fn();

      map.on('change', onChange);
      expect(onChange).toBeCalledTimes(0);
      expect(map.size).eq(0);

      map.clear();
      expect(onChange).toBeCalledTimes(1);
      lastFnResult(onChange, 'clear', undefined, undefined, undefined);
      expect(map.size).eq(0);
    }
    {
      const map = createObsMap(initData);
      const onChange = jest.fn();

      map.on('change', onChange);
      expect(onChange).toBeCalledTimes(0);
      expect(map.size).eq(2);

      map.clear();
      expect(onChange).toBeCalledTimes(1);
      lastFnResult(onChange, 'clear', undefined, undefined, undefined);
      expect(map.size).eq(0);
    }
  });

});
