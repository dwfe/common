import {Throw} from '@do-while-for-each/test';
import {createObsArray, IObsArray, ObsArrayChangeEventListenerParam, ObsValueLike} from '../..';

describe('handled in Proxy.get', () => {

  test('get by index', () => {
    const arr = createObsArray([7, 2, 5, 1, 8, 9]);
    expect(arr[undefined as any]).eq(undefined);
    expect(arr[null as any]).eq(undefined);
    expect(arr[true as any]).eq(undefined);
    expect(arr[false as any]).eq(undefined);
    expect(arr[Symbol.toPrimitive]).eq(undefined);
    expect(arr[{} as any]).eq(undefined);
    expect(arr['']).eq(undefined);
    expect(arr['2']).eq(5);
    expect(arr['2.']).eq(undefined);
    expect(arr['2.7']).eq(undefined);
    expect(arr['s']).eq(undefined);
    expect(arr[NaN]).eq(undefined);
    expect(arr[Infinity]).eq(undefined);
    expect(arr[-Infinity]).eq(undefined);
    expect(arr[0]).eq(7);
    expect(arr[-0]).eq(7);
    expect(arr[0n as any]).eq(7);
    expect(arr[-0n as any]).eq(7);
    expect(arr[4n as any]).eq(8);
    expect(arr['hello']).eq(undefined);
  });

  test('pop', () => {
    const arr = createObsArray<any>([2, 5, 4]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(3);
    expect(onChange).toBeCalledTimes(0);

    let result = arr.pop();
    expect(result).eq(4);
    expect(arr.length).eq(2);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'pop', 4);
    accessByIndex(arr, [2, 5]);

    result = arr.pop();
    expect(result).eq(5);
    expect(arr.length).eq(1);
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'pop', 5);
    accessByIndex(arr, [2]);

    result = arr.pop();
    expect(result).eq(2);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(3);
    lastFnResult(onChange, 'pop', 2);
    accessByIndex(arr, []);

    result = arr.pop();
    expect(result).eq(undefined);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(3);
    lastFnResult(onChange, 'pop', 2);
    accessByIndex(arr, []);

    result = arr.pop();
    expect(result).eq(undefined);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(3);
    lastFnResult(onChange, 'pop', 2);
    accessByIndex(arr, []);

    arr.push(7, 'hello');
    result = arr.pop();
    expect(result).eq('hello');
    expect(arr.length).eq(1);
    expect(onChange).toBeCalledTimes(5);
    lastFnResult(onChange, 'pop', 'hello');
    accessByIndex(arr, [7]);

    result = arr.pop();
    expect(result).eq(7);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(6);
    lastFnResult(onChange, 'pop', 7);
    accessByIndex(arr, []);

    result = arr.pop();
    expect(result).eq(undefined);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(6);
    lastFnResult(onChange, 'pop', 7);
    accessByIndex(arr, []);
  });

  test('push', () => {
    const arr = createObsArray();
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(0);

    let result = arr.push(1);
    expect(result).eq(1);
    expect(arr.length).eq(1);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'push', [1]);
    accessByIndex(arr, [1]);

    result = arr.push(5, 7, 6);
    expect(result).eq(4);
    expect(arr.length).eq(4);
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'push', [5, 7, 6]);
    accessByIndex(arr, [1, 5, 7, 6]);
  });

});

describe('handled in Proxy.set', () => {

  test('set-by-index', () => {
    {
      const arr = createObsArray();
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(0);
      expect(onChange).toBeCalledTimes(0);

      expect(arr[0]).eq(undefined);
      let result: any = (arr[0] = 7);
      expect(arr[0]).eq(7);
      expect(result).eq(7);
      expect(arr.length).eq(1);
      expect(onChange).toBeCalledTimes(1);
      lastFnResult(onChange, 'set-by-index', 0, 7);
      accessByIndex(arr, [7]);

      expect(arr[3]).eq(undefined);
      result = (arr[3] = 'hello');
      expect(arr[3]).eq('hello');
      expect(result).eq('hello');
      expect(arr.length).eq(4);
      expect(onChange).toBeCalledTimes(2);
      lastFnResult(onChange, 'set-by-index', 3, 'hello');
      accessByIndex(arr, [7, undefined, undefined, 'hello']);
    }
    {
      const arr = createObsArray<any>(['hello', 'world', 2, 17]);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(4);
      expect(onChange).toBeCalledTimes(0);

      expect(arr[0]).eq('hello');
      let result: any = (arr[0] = 7);
      expect(arr[0]).eq(7);
      expect(result).eq(7);
      expect(arr.length).eq(4);
      expect(onChange).toBeCalledTimes(1);
      lastFnResult(onChange, 'set-by-index', 0, 7);
      accessByIndex(arr, [7, 'world', 2, 17]);

      expect(arr[2]).eq(2);
      result = (arr[2] = 2);
      expect(arr[2]).eq(2);
      expect(result).eq(2);
      expect(arr.length).eq(4);
      expect(onChange).toBeCalledTimes(2);
      lastFnResult(onChange, 'set-by-index', 2, 2);
      accessByIndex(arr, [7, 'world', 2, 17]);

      expect(arr[2]).eq(2);
      result = (arr[2] = true);
      expect(arr[2]).eq(true);
      expect(result).eq(true);
      expect(arr.length).eq(4);
      expect(onChange).toBeCalledTimes(3);
      lastFnResult(onChange, 'set-by-index', 2, true);
      accessByIndex(arr, [7, 'world', true, 17]);
    }
  });

  test('set-length', () => {
    const arr = createObsArray([1, 2, 3]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(3);
    expect(onChange).toBeCalledTimes(0);

    let result = (arr.length = 0);
    expect(result).eq(0);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'set-length', 0);
    accessByIndex(arr, []);

    result = (arr.length = 3);
    expect(result).eq(3);
    expect(arr.length).eq(3);
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'set-length', 3);
    accessByIndex(arr, [undefined, undefined, undefined]);
  });

});

describe('other', () => {

  test('length', () => {
    expect(createObsArray().length).eq(0);
    expect(createObsArray([]).length).eq(0);
    expect(createObsArray([3]).length).eq(1);
    expect(createObsArray([3, 2, 1]).length).eq(3);
  });

  test('toString', () => {
    expect(String(createObsArray())).eq('');
    expect(String(createObsArray([]))).eq('');
    expect(String(createObsArray([9, 0, 2, 'hello']))).eq('9,0,2,hello');
  });

});

describe('ObsValueLike', () => {

  test('canBeObservable', () => {
    expect(createObsArray()).toHaveProperty('canBeObservable', true);
    expect(createObsArray([1, 2, 3])).toHaveProperty('canBeObservable', true);
  });

  test('on/off "change"', () => {
    const arr = createObsArray([1, 2, 3]);
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();
    checkSupport(arr, 0, false);

    arr.on('change', onChange1);
    checkSupport(arr, 1, true, 1);

    arr.on('change', onChange1);
    checkSupport(arr, 1, true, 1);

    arr.off('change', onChange1);
    checkSupport(arr, 0, false);

    arr.on('change', onChange2);
    checkSupport(arr, 1, true, 1);

    arr.on('change', onChange1);
    checkSupport(arr, 1, true, 2);

    arr.off('change', onChange1);
    checkSupport(arr, 1, true, 1);

    arr.off('change', onChange2);
    checkSupport(arr, 0, false);

    expect(onChange1).toBeCalledTimes(0);
    expect(onChange2).toBeCalledTimes(0);
  });

  test('dispose', () => {
    const arr = createObsArray([]);
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();
    checkSupport(arr, 0, false);

    arr.on('change', onChange2);
    checkSupport(arr, 1, true, 1);

    arr.dispose();
    checkSupport(arr, 0, false);

    arr.on('change', onChange1);
    checkSupport(arr, 1, true, 1);

    arr.on('change', onChange2);
    checkSupport(arr, 1, true, 2);

    arr.dispose();
    checkSupport(arr, 0, false);
  });

});


export function lastFnResult(fn: ReturnType<typeof jest.fn>, type: ObsArrayChangeEventListenerParam<any>['type'], ...rest: any[]) {
  const last = fn.mock.lastCall[0];
  expect(type).eq(last.type);
  switch (type) {
    case 'pop': {
      const value = rest[0];
      expect(value).eq(last.value);
      break;
    }
    case 'push': {
      const items = rest[0] as any[];
      const receivedItems = last.items as any[];
      expect(items.length).eq(receivedItems.length);
      for (let i = 0; i < items.length; i++) {
        expect(items[i]).eq(receivedItems[i]);
      }
      break;
    }
    case 'set-by-index': {
      const index = rest[0];
      const value = rest[1];
      expect(value).eq(last.value);
      expect(index).eq(last.index);
      break;
    }
    case 'set-length': {
      const value = rest[0];
      expect(value).eq(last.value);
      break;
    }
  }
}

function accessByIndex(arr: IObsArray, arrTest: any[]) {
  expect(arr.length).eq(arrTest.length);
  for (let i = 0; i < arr.length; i++) {
    expect(arr[i]).eq(arrTest[i]);
  }
  expect(arr[arr.length]).eq(undefined);
  expect(arr[-1]).eq(undefined);
}

export function checkSupport(arr: ObsValueLike, numberOfIds: number, hasListeners: boolean, numberOfListeners?: number) {
  expect(arr.numberOfIds).eq(numberOfIds);
  expect(arr.hasListeners).eq(hasListeners);
  if (numberOfListeners === undefined)
    Throw(() => arr.numberOfListeners(), `Cannot read properties of undefined (reading 'size')`);
  else
    expect(arr.numberOfListeners()).eq(numberOfListeners);
}
