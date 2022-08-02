import '@do-while-for-each/test';
import {createObsArray, ObsArray, ObsArrayChangeEventListenerParam} from '../..';

describe('observable-array', () => {

  test('access by index', () => {
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
  });

  test('toString', () => {
    expect(String(createObsArray())).eq('');
    expect(String(createObsArray([]))).eq('');
    expect(String(createObsArray([9, 0, 2, 'hello']))).eq('9,0,2,hello');
  });

  test('length', () => {
    expect(createObsArray().length).eq(0);
    expect(createObsArray([]).length).eq(0);
    expect(createObsArray([3]).length).eq(1);
    expect(createObsArray([3, 2, 1]).length).eq(3);
  });

  test('push, +access by index, +on "change"', () => {
    const arr = createObsArray();
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(0);

    arr.push(1);
    expect(arr.length).eq(1);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'add', [1]);
    accessByIndex(arr, [1]);

    arr.push(5, 7, 6);
    expect(arr.length).eq(4);
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'add', [5, 7, 6]);
    accessByIndex(arr, [1, 5, 7, 6]);
  });

  test('on "change"', () => {

  });

  test('off "change"', () => {

  });

  test('dispose', () => {

  });

});


export function lastFnResult(fn: ReturnType<typeof jest.fn>, type: ObsArrayChangeEventListenerParam<any>['type'], items?: any[]) {
  const last = fn.mock.lastCall[0];
  expect(type).eq(last.type);
  if (items) {
    const receivedItems = last.items as any[];
    expect(items.length).eq(receivedItems.length);
    for (let i = 0; i < items.length; i++) {
      expect(items[i]).eq(receivedItems[i]);
    }
  }
}

function accessByIndex(arr: ObsArray, arrTest: any[]) {
  expect(arr.length).eq(arrTest.length);
  for (let i = 0; i < arr.length; i++) {
    expect(arr[i]).eq(arrTest[i]);
  }
  expect(arr[arr.length]).eq(undefined);
  expect(arr[-1]).eq(undefined);
}
