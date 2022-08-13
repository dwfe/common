import {createObsObject, ObsObjectChangeEventListenerParam} from '../..';
import {checkSupport} from './util';

describe('handled in Proxy.set', () => {

  test('set-prop', () => {
    const obj = createObsObject();
    const onChange = jest.fn();
    checkObject(obj, {});

    obj.on('change', onChange);
    expect(Object.keys(obj).length).eq(0);
    expect(onChange).toBeCalledTimes(0);
    checkObject(obj, {});

    expect(obj).not.toHaveProperty('hello');
    let result = (obj.hello = 123);
    expect(result).eq(123);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'set-prop', 'hello', 123);
    checkObject(obj, {hello: 123});
  });

});

describe('ObsValueLike', () => {

  test('canBeObservable', () => {
    expect(createObsObject()).toHaveProperty('canBeObservable', true);
    expect(createObsObject({hello: 123})).toHaveProperty('canBeObservable', true);
  });

  test('on/off "change"', () => {
    const obj = createObsObject({hello: 'world'});
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();
    checkSupport(obj, 0, false);

    obj.on('change', onChange1);
    checkSupport(obj, 1, true, 1);

    obj.on('change', onChange1);
    checkSupport(obj, 1, true, 1);

    obj.off('change', onChange1);
    checkSupport(obj, 0, false);

    obj.on('change', onChange2);
    checkSupport(obj, 1, true, 1);

    obj.on('change', onChange1);
    checkSupport(obj, 1, true, 2);

    obj.off('change', onChange1);
    checkSupport(obj, 1, true, 1);

    obj.off('change', onChange2);
    checkSupport(obj, 0, false);

    expect(onChange1).toBeCalledTimes(0);
    expect(onChange2).toBeCalledTimes(0);
  });

  test('dispose', () => {
    const obj = createObsObject();
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();
    checkSupport(obj, 0, false);

    obj.on('change', onChange2);
    checkSupport(obj, 1, true, 1);

    obj.dispose();
    checkSupport(obj, 0, false);

    obj.on('change', onChange1);
    checkSupport(obj, 1, true, 1);

    obj.on('change', onChange2);
    checkSupport(obj, 1, true, 2);

    obj.dispose();
    checkSupport(obj, 0, false);
  });

});

function lastFnResult(fn: ReturnType<typeof jest.fn>, type: ObsObjectChangeEventListenerParam['type'], ...rest: any[]) {
  const last = fn.mock.lastCall[0];
  expect(type).eq(last.type);
  switch (type) {
    case 'set-prop':
      const [prop, value] = rest;
      expect(prop).eq(last.prop);
      expect(value).eq(last.value);
      break;
  }
}

function checkObject(obj: object, objTest: object) {
  expect(Object.keys(obj).length).eq(Object.keys(objTest).length);
  for (const prop of Object.keys(objTest)) {
    expect(obj[prop]).eq(objTest[prop]);
  }
}
