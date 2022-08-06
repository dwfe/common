import '@do-while-for-each/test';
import {checkSupport} from './obs.array.test';
import {createObsMap} from '../..';

const initData = [['hello', 2], ['world', null]] as any;

const mapEmpty = createObsMap();
const map2Keys = createObsMap(initData);

export function lastFnResult(fn: ReturnType<typeof jest.fn>, type, ...rest: any[]) {
  const last = fn.mock.lastCall[0];
  expect(type).eq(last.type);
  switch (type) {
    case 'add': {
      const [key, value] = rest;
      expect(last.key).eq(key);
      expect(last.value).eq(value);
      break;
    }
    case 'update': {
      const [key, oldValue, value] = rest;
      expect(last.key).eq(key);
      expect(last.oldValue).eq(oldValue);
      expect(last.value).eq(value);
      break;
    }
    case 'delete': {
      const [key, value] = rest;
      expect(last.key).eq(key);
      expect(last.value).eq(value);
      break;
    }
  }
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
    checkSupport(map, 0, false);

    map.on('change', onChange1);
    checkSupport(map, 1, true, 1);

    map.on('change', onChange1);
    checkSupport(map, 1, true, 1);

    map.off('change', onChange1);
    checkSupport(map, 0, false);

    map.on('change', onChange2);
    checkSupport(map, 1, true, 1);

    map.on('change', onChange1);
    checkSupport(map, 1, true, 2);

    map.off('change', onChange1);
    checkSupport(map, 1, true, 1);

    map.off('change', onChange2);
    checkSupport(map, 0, false);
  });

  test('dispose', () => {
    const map = createObsMap();
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();
    checkSupport(map, 0, false);

    map.on('change', onChange2);
    checkSupport(map, 1, true, 1);

    map.dispose();
    checkSupport(map, 0, false);

    map.on('change', onChange1);
    checkSupport(map, 1, true, 1);

    map.on('change', onChange2);
    checkSupport(map, 1, true, 2);

    map.dispose();
    checkSupport(map, 0, false);
  });

});

describe('observable-map. #2', () => {

  test('canBeObservable', () => {
    expect(createObsMap()).toHaveProperty('canBeObservable', true);
    expect(map2Keys).toHaveProperty('canBeObservable', true);
  });

  test('set', () => {
    const map = createObsMap();
    const onChange = jest.fn();

    map.on('change', onChange);
    expect(onChange).toBeCalledTimes(0);
    expect(map.size).eq(0);

    let result = map.set('hello', 'Alex');
    expect(result).eq(map);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'add', 'hello', 'Alex');
    expect(map.size).eq(1);

    result = map.set('hello', 'Alex');
    expect(result).eq(map);
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'update', 'hello', 'Alex', 'Alex');
    expect(map.size).eq(1);

    result = map.set('hello', 17);
    expect(result).eq(map);
    expect(onChange).toBeCalledTimes(3);
    lastFnResult(onChange, 'update', 'hello', 'Alex', 17);
    expect(map.size).eq(1);

    result = map.set('world', true);
    expect(result).eq(map);
    expect(onChange).toBeCalledTimes(4);
    lastFnResult(onChange, 'add', 'world', true);
    expect(map.size).eq(2);
  });

  test('delete', () => {
    const map = createObsMap(initData);
    const onChange = jest.fn();

    map.on('change', onChange);
    expect(onChange).toBeCalledTimes(0);
    expect(map.size).eq(2);

    let result = map.delete('say');
    expect(result).False();
    expect(onChange).toBeCalledTimes(0);
    expect(map.size).eq(2);

    result = map.delete('world');
    expect(result).True();
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

  test('set-prop / delete-prop', () => {
    const map = createObsMap();
    const onChange = jest.fn();

    map.on('change', onChange);
    expect(map.size).eq(0);
    expect(onChange).toBeCalledTimes(0);

    expect(map).not.toHaveProperty('hello');
    let result = (map['hello'] = 'world');
    expect(result).eq('world');
    expect(map.size).eq(0);
    expect(onChange).toBeCalledTimes(1);
    expect(map).toHaveProperty('hello', 'world');

    let last = onChange.mock.lastCall[0];
    expect(last.type).eq('set-prop');
    expect(last.prop).eq('hello');
    expect(last.value).eq('world');

    expect(map).toHaveProperty('hello', 'world');
    delete map['hello'];
    expect(map).not.toHaveProperty('hello');
    last = onChange.mock.lastCall[0];
    expect(last.type).eq('delete-prop');
    expect(last.prop).eq('hello');
  });

  // test('defineProperty', () => {
  //   const map = createObsMap();
  //   const onChange = jest.fn();
  //
  //   map.on('change', onChange);
  //   expect(map.size).eq(0);
  //   expect(onChange).toBeCalledTimes(0);
  //   expect(map).not.toHaveProperty('hello');
  //
  //   Object.defineProperty(map, 'hello', {
  //     value: 123,
  //   });
  //
  //   expect(map.size).eq(0);
  //   expect(onChange).toBeCalledTimes(1);
  //   const last = onChange.mock.lastCall[0];
  //   expect(last.type).eq('define-prop');
  //   expect(last.prop).eq('hello');
  //   expect(last.descriptor.value).eq(123);
  //   expect(map).toHaveProperty('hello', 123);
  // });


});

describe('observable-map. creating', () => {

  test('no arguments', () => {
    const map = createObsMap();
    expect(map.size).eq(0);
  });

  test('[K, V][]', () => {
    const map = createObsMap([['world', 123], ['hello', 17]]);
    expect(map.size).eq(2);
    expect(map.get('world')).eq(123);
    expect(map.get('hello')).eq(17);
  });

  test('Map<K, V>', () => {
    const map = createObsMap(
      new Map<any, any>([
        ['hello', 'world'], [123, 17], [true, false]
      ])
    );
    expect(map.size).eq(3);
    expect(map.get('hello')).eq('world');
    expect(map.get(123)).eq(17);
    expect(map.get(true)).eq(false);
  });

});
