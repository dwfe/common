import {createObsObject, ObsObjectChangeEventListenerParam} from '../..';
import {checkSupport} from './util';

describe('handled in Proxy.set / .deleteProperty', () => {

  test('set-prop / delete-prop', () => {
    const obj = createObsObject();
    const onChange = jest.fn();

    obj.on('change', onChange);
    expect(onChange).toBeCalledTimes(0);
    checkObject(obj, {});

    expect(obj).not.toHaveProperty('hello');
    let result = (obj.hello = 123);
    expect(result).eq(123);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'set-prop', 'hello', 123);
    checkObject(obj, {hello: 123});

    expect(obj).toHaveProperty('hello');
    delete obj.hello;
    expect(obj).not.toHaveProperty('hello');
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'delete-prop', 'hello');
    checkObject(obj, {});
  });

  test('some', () => {
    const obj = createObsObject({
      firstName: 'Jane',
      lastName: 'Smith',
      setAge(age) {
        //@ts-ignore
        this.age = age;
      }
    });
    const onChange = jest.fn();

    obj.on('change', onChange);
    expect(onChange).toBeCalledTimes(0);
    checkObject(obj, {
      firstName: 'Jane',
      lastName: 'Smith',
      setAge(age) {
        //@ts-ignore
        this.age = age;
      }
    });

    expect(obj).not.toHaveProperty('age');
    obj.setAge(10);
    expect(onChange).toBeCalledTimes(1);
    lastFnResult(onChange, 'set-prop', 'age', 10);
    checkObject(obj, {
      firstName: 'Jane',
      lastName: 'Smith',
      setAge(age) {
        //@ts-ignore
        this.age = age;
      },
      age: 10,
    });

    expect(obj).toHaveProperty('firstName');
    //@ts-ignore
    delete obj.firstName;
    expect(obj).not.toHaveProperty('firstName');
    expect(onChange).toBeCalledTimes(2);
    lastFnResult(onChange, 'delete-prop', 'firstName');
    checkObject(obj, {
      lastName: 'Smith',
      setAge(age) {
        //@ts-ignore
        this.age = age;
      },
      age: 10,
    });
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
    case 'set-prop': {
      const [prop, value] = rest;
      expect(prop).eq(last.prop);
      expect(value).eq(last.value);
      break;
    }
    case 'delete-prop': {
      const [prop] = rest;
      expect(prop).eq(last.prop);
      break;
    }
  }
}

function checkObject(obj: object, objTest: object) {
  expect(Object.keys(obj).length).eq(Object.keys(objTest).length);
  for (const prop of Object.keys(objTest)) {
    if (typeof obj[prop] === 'function') {
      expect(typeof objTest[prop]).eq('function');
    } else {
      expect(obj[prop]).eq(objTest[prop]);
    }
  }
}
