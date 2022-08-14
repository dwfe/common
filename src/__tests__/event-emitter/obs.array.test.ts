import {Throw} from '@do-while-for-each/test';
import {createObsArray, ObsArrayChangeEventListenerParam, ObsValueLike} from '../..';
import {checkSupport} from './util';

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
    expect(arr[-2]).eq(undefined);
  });

  test('copyWithin', () => {
    function checkCopyWithin(initArr: any[], [target, start, end]: any[], expectedResult: any[]) {
      const arr = createObsArray(initArr);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(initArr.length);
      expect(onChange).toBeCalledTimes(0);

      let result = arr.copyWithin(target, start, end);
      expect(result).eq(arr);
      expect(arr.length).eq(5);
      expect(onChange).toBeCalledTimes(1);
      lastFnResult(onChange, 'copyWithin', target, start, end);
      checkArray(arr, expectedResult);
    }

    checkCopyWithin([1, 2, 3, 4, 5], [0, 3], [4, 5, 3, 4, 5]);
    checkCopyWithin([1, 2, 3, 4, 5], [0, 3, 4], [4, 2, 3, 4, 5]);
    checkCopyWithin([1, 2, 3, 4, 5], [0, 3, 6], [4, 5, 3, 4, 5]);
    checkCopyWithin([1, 2, 3, 4, 5], [0, -2, -1], [4, 2, 3, 4, 5]);
  });

  test('fill', () => {
    function checkFill(initArr: any[], [value, start, end]: any[], expectedResult: any[]) {
      const arr = createObsArray(initArr);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(initArr.length);
      expect(onChange).toBeCalledTimes(0);

      let result = arr.fill(value, start, end);
      expect(result).eq(arr);
      expect(arr.length).eq(3);
      expect(onChange).toBeCalledTimes(1);
      lastFnResult(onChange, 'fill', value, start, end);
      checkArray(arr, expectedResult);
    }

    checkFill([1, 2, 3], [4], [4, 4, 4]);
    checkFill([1, 2, 3], [4, 1], [1, 4, 4]);
    checkFill([1, 2, 3], [4, 1, 2], [1, 4, 3]);
    checkFill([1, 2, 3], [4, 1, 1], [1, 2, 3]);
    checkFill([1, 2, 3], [4, 3, 3], [1, 2, 3]);
    checkFill([1, 2, 3], [4, -3, -2], [4, 2, 3]);
    checkFill([1, 2, 3], [4, NaN, NaN], [1, 2, 3]);
    checkFill([1, 2, 3], [4, 3, 5], [1, 2, 3]);
    checkFill(Array(3), [4], [4, 4, 4]);
    const obj = {};
    checkFill(Array(3), [obj], [obj, obj, obj]);
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
    checkArray(arr, [2, 5]);

    result = arr.pop();
    expect(result).eq(5);
    expect(arr.length).eq(1);
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'pop', 5);
    checkArray(arr, [2]);

    result = arr.pop();
    expect(result).eq(2);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(3);
    lastFnResult(onChange, 'pop', 2);
    checkArray(arr, []);

    result = arr.pop();
    expect(result).eq(undefined);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(3);
    lastFnResult(onChange, 'pop', 2);
    checkArray(arr, []);

    result = arr.pop();
    expect(result).eq(undefined);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(3);
    lastFnResult(onChange, 'pop', 2);
    checkArray(arr, []);

    arr.push(7, 'hello');
    result = arr.pop();
    expect(result).eq('hello');
    expect(arr.length).eq(1);
    expect(onChange).toBeCalledTimes(5);
    lastFnResult(onChange, 'pop', 'hello');
    checkArray(arr, [7]);

    result = arr.pop();
    expect(result).eq(7);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(6);
    lastFnResult(onChange, 'pop', 7);
    checkArray(arr, []);

    result = arr.pop();
    expect(result).eq(undefined);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(6);
    lastFnResult(onChange, 'pop', 7);
    checkArray(arr, []);
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
    checkArray(arr, [1]);

    result = arr.push(5, 7, 6);
    expect(result).eq(4);
    expect(arr.length).eq(4);
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'push', [5, 7, 6]);
    checkArray(arr, [1, 5, 7, 6]);
  });

  test('reverse', () => {
    function checkReverse(initArr: any[], expectedResult: any[]) {
      const arr = createObsArray(initArr);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(initArr.length);
      expect(onChange).toBeCalledTimes(0);

      let result = arr.reverse();
      expect(result).eq(arr);
      expect(arr.length).eq(expectedResult.length);
      expect(onChange).toBeCalledTimes(1);
      const last = onChange.mock.lastCall[0];
      expect(last.type).eq('reverse');
      checkArray(arr, expectedResult);
    }

    checkReverse(['one', 'two', 'three'], ['three', 'two', 'one']);
    checkReverse([1, 2, 3, 4, 5], [5, 4, 3, 2, 1]);
    checkReverse(['hello', 7, 'привет', null, true], [true, null, 'привет', 7, 'hello']);
  });

  test('shift', () => {
    {
      const arr = createObsArray([]);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(0);
      expect(onChange).toBeCalledTimes(0);

      let result = arr.shift();
      expect(result).eq(undefined);
      expect(arr.length).eq(0);
      expect(onChange).toBeCalledTimes(0);
    }
    {
      const arr = createObsArray([17, 'hello']);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(2);
      expect(onChange).toBeCalledTimes(0);

      let result = arr.shift();
      expect(result).eq(17);
      expect(arr.length).eq(1);
      expect(onChange).toBeCalledTimes(1);
      let last = onChange.mock.lastCall[0];
      expect(last.type).eq('shift');
      expect(last.value).eq(17);
      checkArray(arr, ['hello']);

      result = arr.shift();
      expect(result).eq('hello');
      expect(arr.length).eq(0);
      expect(onChange).toBeCalledTimes(2);
      last = onChange.mock.lastCall[0];
      expect(last.type).eq('shift');
      expect(last.value).eq('hello');
      checkArray(arr, []);

      result = arr.shift();
      expect(result).eq(undefined);
      expect(arr.length).eq(0);
      expect(onChange).toBeCalledTimes(2);
      checkArray(arr, []);
    }
  });

  test('sort', () => {
    function checkSort(initArr: any[], expectedResult: any[], compareFn?: (a, b) => number) {
      const arr = createObsArray(initArr);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(initArr.length);
      expect(onChange).toBeCalledTimes(0);

      let result = arr.sort(compareFn);
      expect(result).eq(arr);
      expect(arr.length).eq(expectedResult.length);
      expect(onChange).toBeCalledTimes(1);
      const last = onChange.mock.lastCall[0];
      expect(last.type).eq('sort');
      checkArray(arr, expectedResult);
    }

    function compareNumbers(a, b) {
      return a - b;
    }

    checkSort(['Blue', 'Humpback', 'Beluga'], ['Beluga', 'Blue', 'Humpback']);
    checkSort([40, 1, 5, 200], [1, 200, 40, 5]);
    checkSort([40, 1, 5, 200], [1, 5, 40, 200], compareNumbers);
    checkSort(['80', '9', '700'], ['700', '80', '9']);
    checkSort(['80', '9', '700'], ['9', '80', '700'], compareNumbers);
    checkSort(['80', '9', '700', 40, 1, 5, 200], [1, 200, 40, 5, '700', '80', '9']);
    checkSort(['80', '9', '700', 40, 1, 5, 200], [1, 5, '9', 40, '80', 200, '700'], compareNumbers);
  });

  test('splice', () => {
    function checkSplice(initArr: any[], expectedResult: any[], params: {
      start: number; deleteCount?: number; items: any[]
    }, mustBeDeleted: any[]) {
      const arr = createObsArray(initArr);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(initArr.length);
      expect(onChange).toBeCalledTimes(0);

      const result: any[] = params.deleteCount === undefined
        ? arr.splice(params.start)
        : arr.splice(params.start, params.deleteCount, ...params.items);

      checkArray(result, mustBeDeleted);
      expect(arr.length).eq(expectedResult.length);
      expect(onChange).toBeCalledTimes(1);
      const last = onChange.mock.lastCall[0];
      expect(last.type).eq('splice');
      checkArray(last.deletedItems, mustBeDeleted);
      expect(last.deleteCount).eq(params.deleteCount);
      checkArray(last.addedItems, params.items);
      checkArray(arr, expectedResult);
    }

    checkSplice( // Remove 0 (zero) elements before index 2, and insert "drum"
      ['angel', 'clown', 'mandarin', 'sturgeon'],
      ['angel', 'clown', 'drum', 'mandarin', 'sturgeon'],
      {start: 2, deleteCount: 0, items: ['drum']},
      []
    );
    checkSplice( // Remove 0 (zero) elements before index 2, and insert "drum" and "guitar"
      ['angel', 'clown', 'mandarin', 'sturgeon'],
      ['angel', 'clown', 'drum', 'guitar', 'mandarin', 'sturgeon'],
      {start: 2, deleteCount: 0, items: ['drum', 'guitar']},
      []
    );
    checkSplice( // Remove 1 element at index 3
      ['angel', 'clown', 'drum', 'mandarin', 'sturgeon'],
      ['angel', 'clown', 'drum', 'sturgeon'],
      {start: 3, deleteCount: 1, items: []},
      ['mandarin']
    );
    checkSplice( // Remove 1 element at index 2, and insert "trumpet"
      ['angel', 'clown', 'drum', 'sturgeon'],
      ['angel', 'clown', 'trumpet', 'sturgeon'],
      {start: 2, deleteCount: 1, items: ['trumpet']},
      ['drum']
    );
    checkSplice( // Remove 2 elements from index 0, and insert "parrot", "anemone" and "blue"
      ['angel', 'clown', 'trumpet', 'sturgeon'],
      ['parrot', 'anemone', 'blue', 'trumpet', 'sturgeon'],
      {start: 0, deleteCount: 2, items: ['parrot', 'anemone', 'blue']},
      ['angel', 'clown']
    );
    checkSplice( // Remove 2 elements, starting from index 2
      ['parrot', 'anemone', 'blue', 'trumpet', 'sturgeon'],
      ['parrot', 'anemone', 'sturgeon'],
      {start: 2, deleteCount: 2, items: []},
      ['blue', 'trumpet']
    );
    checkSplice( // Remove 1 element from index -2
      ['angel', 'clown', 'mandarin', 'sturgeon'],
      ['angel', 'clown', 'sturgeon'],
      {start: -2, deleteCount: 1, items: []},
      ['mandarin']
    );
    checkSplice( // Remove all elements, starting from index 2
      ['angel', 'clown', 'mandarin', 'sturgeon'],
      ['angel', 'clown'],
      {start: 2, items: []},
      ['mandarin', 'sturgeon']
    );
    checkSplice( // Clear array
      [1, 2, 3, 4, 5, 6],
      [],
      {start: 0, items: []},
      [1, 2, 3, 4, 5, 6]
    );
    checkSplice( // Remove more than length
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 'hello'],
      {start: 3, deleteCount: 5, items: ['hello']},
      [4, 5, 6]
    );
  });

  test('unshift', () => {
    const arr = createObsArray();
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(0);

    let result = arr.unshift(1);
    expect(result).eq(1);
    expect(arr.length).eq(1);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'unshift', [1]);
    checkArray(arr, [1]);

    result = arr.unshift(5, 7, 6);
    expect(result).eq(4);
    expect(arr.length).eq(4);
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'unshift', [5, 7, 6]);
    checkArray(arr, [5, 7, 6, 1]);
  });

});

describe('handled in Proxy.set / .deleteProperty', () => {

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
      checkArray(arr, [7]);

      expect(arr[3]).eq(undefined);
      result = (arr[3] = 'hello');
      expect(arr[3]).eq('hello');
      expect(result).eq('hello');
      expect(arr.length).eq(4);
      expect(onChange).toBeCalledTimes(2);
      lastFnResult(onChange, 'set-by-index', 3, 'hello');
      checkArray(arr, [7, undefined, undefined, 'hello']);
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
      checkArray(arr, [7, 'world', 2, 17]);

      expect(arr[2]).eq(2);
      result = (arr[2] = 2);
      expect(arr[2]).eq(2);
      expect(result).eq(2);
      expect(arr.length).eq(4);
      expect(onChange).toBeCalledTimes(2);
      lastFnResult(onChange, 'set-by-index', 2, 2);
      checkArray(arr, [7, 'world', 2, 17]);

      expect(arr[2]).eq(2);
      result = (arr[2] = true);
      expect(arr[2]).eq(true);
      expect(result).eq(true);
      expect(arr.length).eq(4);
      expect(onChange).toBeCalledTimes(3);
      lastFnResult(onChange, 'set-by-index', 2, true);
      checkArray(arr, [7, 'world', true, 17]);
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
    checkArray(arr, []);

    result = (arr.length = 3);
    expect(result).eq(3);
    expect(arr.length).eq(3);
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'set-length', 3);
    checkArray(arr, [undefined, undefined, undefined]);

    result = (arr.length = 0);
    expect(result).eq(0);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(3);
    lastFnResult(onChange, 'set-length', 0);
    checkArray(arr, []);
  });

  test('set-prop / delete-prop', () => {
    const arr = createObsArray();
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(0);

    expect(arr).not.toHaveProperty('hello');
    let result = (arr['hello'] = 'world');
    expect(result).eq('world');
    expect(arr.length).eq(0);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'set-prop', 'hello', 'world');
    checkArray(arr, []);

    expect(arr).toHaveProperty('hello');
    delete arr['hello'];
    expect(arr).not.toHaveProperty('hello');
    expect(onChange).toBeCalledTimes(2);
    const last = onChange.mock.lastCall[0];
    expect(last.type).eq('delete-prop');
    expect(last.prop).eq('hello');
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

  test('Proxy is Array', () => {
    const proxy = createObsArray();
    expect(Array.isArray(proxy)).True();
    Throw(() => (proxy instanceof Proxy), `Function has non-object prototype 'undefined' in instanceof check`);
  });

});

describe('methods that do not emit changes', () => {

  test('iterator, for..of', () => {
    const arr = createObsArray([0, 1, 2, 3, 4]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(5);
    expect(onChange).toBeCalledTimes(0);

    let count = 0;
    for (const item of arr) {
      expect(item).eq(arr[count++]);
    }
    expect(onChange).toBeCalledTimes(0);
  });

  test('keys', () => {
    const arr = createObsArray(['a', , 'c']);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(3);
    expect(onChange).toBeCalledTimes(0);

    checkArray([...arr.keys()], [0, 1, 2]);

    expect(onChange).toBeCalledTimes(0);
  });

  test('values', () => {
    const arr = createObsArray(['a', 'b', 'c']);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(3);
    expect(onChange).toBeCalledTimes(0);

    checkArray([...arr.values()], ['a', 'b', 'c']);

    expect(onChange).toBeCalledTimes(0);
  });

  test('entries', () => {
    const arr = createObsArray(['a', 'b', 'c']);
    const eArr = arr.entries();
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(3);
    expect(onChange).toBeCalledTimes(0);

    checkArray(eArr.next().value, [0, 'a']);
    checkArray(eArr.next().value, [1, 'b']);
    checkArray(eArr.next().value, [2, 'c']);

    expect(onChange).toBeCalledTimes(0);
  });


  test('at', () => {
    const arr = createObsArray([0, 1, 2, 3, 4]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(5);
    expect(onChange).toBeCalledTimes(0);

    expect(arr.at(-1)).eq(4);
    expect(arr.at(4)).eq(4);
    expect(arr.at(-2)).eq(3);
    expect(arr.at(0)).eq(0);

    expect(onChange).toBeCalledTimes(0);
  });

  test('concat', () => {
    {
      const arr = createObsArray<any>(['a', 'b', 'c']);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(3);
      expect(onChange).toBeCalledTimes(0);

      checkArray(arr.concat([1, 2, 3]), ['a', 'b', 'c', 1, 2, 3]);

      expect(onChange).toBeCalledTimes(0);
    }
    {
      const arr = createObsArray<any>([1, 2, 3]);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(3);
      expect(onChange).toBeCalledTimes(0);

      checkArray(arr.concat([4, 5, 6], [7, 8, 9]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);

      expect(onChange).toBeCalledTimes(0);
    }
    {
      const arr = createObsArray<any>(['a', 'b', 'c']);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(3);
      expect(onChange).toBeCalledTimes(0);

      checkArray(arr.concat(1, [2, 3]), ['a', 'b', 'c', 1, 2, 3]);

      expect(onChange).toBeCalledTimes(0);
    }
  });

  test('every', () => {
    {
      const arr = createObsArray([12, 5, 8, 130, 44]);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(5);
      expect(onChange).toBeCalledTimes(0);

      expect(arr.every(elem => elem >= 10)).False();

      expect(onChange).toBeCalledTimes(0);
    }
    {
      const arr = createObsArray([12, 54, 18, 130, 44]);
      const onChange = jest.fn();

      arr.on('change', onChange);
      expect(arr.length).eq(5);
      expect(onChange).toBeCalledTimes(0);

      expect(arr.every(elem => elem >= 10)).True();

      expect(onChange).toBeCalledTimes(0);
    }
  });

  test('filter', () => {
    const arr = createObsArray([0, 1, 2, 3, 4]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(5);
    expect(onChange).toBeCalledTimes(0);

    checkArray(arr.filter(x => x > 2), [3, 4,]);
    checkArray(arr.filter(x => x < 0), []);

    expect(onChange).toBeCalledTimes(0);
  });

  test('find', () => {
    const arr = createObsArray([0, 1, 2, 3, 4]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(5);
    expect(onChange).toBeCalledTimes(0);

    expect(arr.find(x => x > 2)).eq(3);
    expect(arr.find(x => x > 4)).eq(undefined);

    expect(onChange).toBeCalledTimes(0);
  });

  test('findIndex', () => {
    const arr = createObsArray([0, 1, 2, 3, 4]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(5);
    expect(onChange).toBeCalledTimes(0);

    expect(arr.findIndex(x => x > 2)).eq(3);
    expect(arr.findIndex(x => x > 4)).eq(-1);

    expect(onChange).toBeCalledTimes(0);
  });

  test('flat', () => {
    const arr = createObsArray([0, 1, 2, [[[3, 4]]]]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(4);
    expect(onChange).toBeCalledTimes(0);

    checkArray(arr.flat(3), [0, 1, 2, 3, 4]);

    expect(onChange).toBeCalledTimes(0);
  });

  test('flatMap', () => {
    const arr = createObsArray([`it's Sunny in`, '', 'California']);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(3);
    expect(onChange).toBeCalledTimes(0);

    checkArray(arr.flatMap((x) => x.split(' ')), [`it's`, 'Sunny', 'in', '', 'California']);

    expect(onChange).toBeCalledTimes(0);
  });

  test('forEach', () => {
    const arr = createObsArray([0, 1, 2, 3, 4]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(5);
    expect(onChange).toBeCalledTimes(0);

    arr.forEach((value, index) => {
      expect(arr[index]).eq(value);
    });

    expect(onChange).toBeCalledTimes(0);
  });

  test('includes', () => {
    const arr = createObsArray([0, 1, 2, 3, 4]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(5);
    expect(onChange).toBeCalledTimes(0);

    expect(arr.includes(3)).True();
    expect(arr.includes(30)).False();

    expect(onChange).toBeCalledTimes(0);
  });

  test('indexOf', () => {
    const arr = createObsArray(['ant', 'bison', 'camel', 'duck', 'bison']);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(5);
    expect(onChange).toBeCalledTimes(0);

    expect(arr.indexOf('bison')).eq(1);
    expect(arr.indexOf('bison', 2)).eq(4);
    expect(arr.indexOf('giraffe')).eq(-1);

    expect(onChange).toBeCalledTimes(0);
  });

  test('join', () => {
    const arr = createObsArray(['Fire', 'Air', 'Water']);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(3);
    expect(onChange).toBeCalledTimes(0);

    expect(arr.join()).eq('Fire,Air,Water');
    expect(arr.join('')).eq('FireAirWater');
    expect(arr.join('-')).eq('Fire-Air-Water');

    expect(onChange).toBeCalledTimes(0);
  });

  test('lastIndexOf', () => {
    const arr = createObsArray(['Dodo', 'Tiger', 'Penguin', 'Dodo']);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(4);
    expect(onChange).toBeCalledTimes(0);

    expect(arr.lastIndexOf('Dodo')).eq(3);
    expect(arr.lastIndexOf('Tiger')).eq(1);
    expect(arr.lastIndexOf('Dog')).eq(-1);

    expect(onChange).toBeCalledTimes(0);
  });

  test('map', () => {
    const arr = createObsArray([0, 1, 2, 3, 4]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(5);
    expect(onChange).toBeCalledTimes(0);

    checkArray(arr.map(x => x * 2), [0, 2, 4, 6, 8]);

    expect(onChange).toBeCalledTimes(0);
  });

  test('reduce', () => {
    const arr = createObsArray([0, 1, 2, 3, 4, 5]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(6);
    expect(onChange).toBeCalledTimes(0);

    checkArray(
      arr.reduce((acc, next) => {
        if (next < 2 || next >= 4) {
          acc.push(next);
        }
        return acc;
      }, [] as any[]),
      [0, 1, 4, 5]
    );

    expect(onChange).toBeCalledTimes(0);
  });

  test('reduceRight', () => {
    const arr = createObsArray([[0, 1], [2, 3], [4, 5]]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(3);
    expect(onChange).toBeCalledTimes(0);

    checkArray(
      arr.reduceRight((acc, next) => acc.concat(next)),
      [4, 5, 2, 3, 0, 1]
    );

    expect(onChange).toBeCalledTimes(0);
  });

  test('some', () => {
    const arr = createObsArray([0, 1, 2, 3, 4]);
    const onChange = jest.fn();

    arr.on('change', onChange);
    expect(arr.length).eq(5);
    expect(onChange).toBeCalledTimes(0);

    expect(arr.some(x => x > 3)).True();
    expect(arr.some(x => x > 30)).False();

    expect(onChange).toBeCalledTimes(0);
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

// describe('handled in Proxy.defineProperty', () => {
//
//   test('defineProperty', () => {
//     const arr = createObsArray([1, 2, 3]);
//     const onChange = jest.fn();
//
//     arr.on('change', onChange);
//     expect(arr.length).eq(3);
//     expect(onChange).toBeCalledTimes(0);
//     expect(arr).not.toHaveProperty('hello');
//
//     Object.defineProperty(arr, 'hello', {
//       value: 123,
//     });
//
//     expect(arr.length).eq(3);
//     expect(onChange).toBeCalledTimes(1);
//     checkArray(arr, [1, 2, 3]);
//     const last = onChange.mock.lastCall[0];
//     expect(last.type).eq('define-prop');
//     expect(last.prop).eq('hello');
//     expect(last.descriptor.value).eq(123);
//     expect(arr).toHaveProperty('hello', 123);
//   });
//
// });

export function lastFnResult(fn: ReturnType<typeof jest.fn>, type: ObsArrayChangeEventListenerParam<any>['type'], ...rest: any[]) {
  const last = fn.mock.lastCall[0];
  expect(type).eq(last.type);
  switch (type) {
    case 'copyWithin': {
      const [target, start, end] = rest;
      expect(target).eq(last.target);
      expect(start).eq(last.start);
      expect(end).eq(last.end);
      break;
    }
    case 'fill': {
      const [value, start, end] = rest;
      expect(value).eq(last.value);
      expect(start).eq(last.start);
      expect(end).eq(last.end);
      break;
    }
    case 'pop': {
      const value = rest[0];
      expect(value).eq(last.value);
      break;
    }
    case 'push':
    case 'unshift': {
      const items = rest[0] as any[];
      const receivedItems = last.items as any[];
      expect(items.length).eq(receivedItems.length);
      for (let i = 0; i < items.length; i++) {
        expect(items[i]).eq(receivedItems[i]);
      }
      break;
    }
    case 'set-by-index': {
      const [index, value] = rest;
      expect(value).eq(last.value);
      expect(index).eq(last.index);
      break;
    }
    case 'set-length': {
      const value = rest[0];
      expect(value).eq(last.value);
      break;
    }
    case 'set-prop': {
      const [prop, value] = rest;
      expect(prop).eq(last.prop);
      expect(value).eq(last.value);
      break;
    }
  }
}

function checkArray(arr: any[], arrTest: any[]) {
  expect(arr.length).eq(arrTest.length);
  for (let i = 0; i < arr.length; i++) {
    expect(arr[i]).eq(arrTest[i]);
  }
  expect(arr[arr.length]).eq(undefined);
  expect(arr[-1]).eq(undefined);
}

