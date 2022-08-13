import {checkSupport} from './obs.array.test';
import {createObsObject} from '../..';

describe('', () => {

  test('', () => {

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
