import {noop, noop2, Throw} from '@do-while-for-each/test';
import {EventEmitter} from '../..';

describe(`event-emitter`, () => {

  test('canBeObservable', () => {
    expect(new EventEmitter<{ change: void, load: void }>()).toHaveProperty('canBeObservable', true);
  });

  test(`hasSubscribers`, () => {
    const emitter = new EventEmitter<{ change: void, load: void }>();
    expect(emitter.numberOfIds).eq(0);
    expect(emitter.hasListeners).toBe(false);

    emitter.on('load', noop);
    expect(emitter.numberOfIds).toBe(1);
    expect(emitter.hasListeners).toBe(true);
    emitter.on('change', noop2);
    expect(emitter.numberOfIds).toBe(2);
    expect(emitter.hasListeners).toBe(true);

    emitter.off('load', noop);
    expect(emitter.numberOfIds).toBe(1);
    expect(emitter.hasListeners).toBe(true);
    emitter.off('change', noop2);
    expect(emitter.numberOfIds).toBe(0);
    expect(emitter.hasListeners).toBe(false);
  });

  test(`subscribe/unsubscribe`, () => {
    const emitter = new EventEmitter<{ change: void, load: void }>();
    expect(emitter.hasListeners).toBe(false);
    expect(emitter.hasId('change')).toBe(false);
    expect(emitter.hasId('load')).toBe(false);

    emitter.addEventListener('change', noop);
    expect(emitter.numberOfIds).toBe(1);
    expect(emitter.numberOfListeners('change')).eq(1);

    emitter.on('load', noop2);
    expect(emitter.numberOfListeners('load')).eq(1);

    emitter.on('load', noop);
    expect(emitter.numberOfListeners('load')).eq(2);
    expect(emitter.numberOfIds).toBe(2);
    expect(emitter.hasId('change')).toBe(true);
    expect(emitter.hasId('load')).toBe(true);

    emitter.removeEventListener('change', noop2);
    expect(emitter.numberOfListeners('change')).eq(1);
    expect(emitter.numberOfIds).toBe(2);

    emitter.off('change', noop);
    Throw(() => emitter.numberOfListeners('change'), `Cannot read properties of undefined (reading 'size')`);
    expect(emitter.numberOfIds).toBe(1);

    emitter.off('load', noop2);
    expect(emitter.numberOfListeners('load')).eq(1);
    expect(emitter.numberOfIds).toBe(1);

    emitter.removeEventListener('load', noop);
    Throw(() => emitter.numberOfListeners('load'), `Cannot read properties of undefined (reading 'size')`);
    expect(emitter.hasListeners).toBe(false);
    expect(emitter.hasId('change')).toBe(false);
    expect(emitter.hasId('load')).toBe(false);
  });

  test(`return unsubscriber on subscribe`, () => {
    const emitter = new EventEmitter<{ change: void, load: void }>();
    expect(emitter.hasListeners).toBe(false);
    let unsubscriber = emitter.on('change', noop);
    expect(emitter.numberOfIds).toBe(1);
    unsubscriber();
    expect(emitter.hasListeners).toBe(false);

    unsubscriber = emitter.addEventListener('change', noop2);
    expect(emitter.numberOfIds).toBe(1);
    unsubscriber();
    expect(emitter.hasListeners).toBe(false);
  });

  test(`dispose`, () => {
    const emitter = new EventEmitter<{ move: void, drag: void; up: number; }>();
    expect(emitter.hasListeners).toBe(false);

    emitter.addEventListener('move', () => console.log(`move`,));
    emitter.on('drag', () => console.log(`drag`,));
    emitter.on('drag', noop);
    emitter.on('drag', noop);
    emitter.on('drag', noop2);
    emitter.on('up', noop2);
    expect(emitter.numberOfIds).toBe(3);

    emitter.dispose();
    expect(emitter.hasListeners).toBe(false);
  });

  test(`emit`, () => {
    const count = {change: 0, load: 0,};
    const emitter = new EventEmitter<{ change: void, load: void }>();
    emitter.addEventListener('change', () => ++count.change);
    emitter.on('load', () => ++count.load);
    expect(count.change).toBe(0);
    expect(count.load).toBe(0);
    emitter.emit('change');
    emitter.emit('change');
    expect(count.change).toBe(2);
    expect(count.load).toBe(0);
    emitter.emit('load');
    expect(count.change).toBe(2);
    expect(count.load).toBe(1);
    emitter.emit('load');
    emitter.emit('load');
    expect(count.change).toBe(2);
    expect(count.load).toBe(3);

    emitter.on('load', () => {
      count.load = count.load - 2;
    });
    emitter.emit('change');
    emitter.emit('load');
    emitter.emit('load');
    emitter.emit('load');
    expect(count.change).toBe(3);
    expect(count.load).toBe(0);
  });

  test(`onFirstSubscribe, onUnobserved: add multi event -> step by step remove`, () => {
    let firstSubscribeArr: any[] = [];
    let countUnobserved = 0;
    const emitter = new EventEmitter<{ change: void, load: void }>();
    emitter.onFirstSubscribed = (id) => firstSubscribeArr.push(id);
    emitter.onLastUnsubscribed = () => countUnobserved++;
    expect(firstSubscribeArr.length).toBe(0);
    expect(countUnobserved).toBe(0);
    emitter.on('change', noop);
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('change');
    expect(countUnobserved).toBe(0);
    emitter.on('change', noop2);
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('change');
    expect(countUnobserved).toBe(0);
    emitter.on('load', noop2);
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('change');
    expect(countUnobserved).toBe(0);
    emitter.off('change', noop);
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('change');
    expect(countUnobserved).toBe(0);
    emitter.off('load', noop2);
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('change');
    expect(countUnobserved).toBe(0);
    emitter.off('change', noop2);
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('change');
    expect(countUnobserved).toBe(1);
  });

  test(`onFirstSubscribe, onUnobserved: add one event -> dispose + resubscribe`, () => {
    let firstSubscribeArr: any[] = [];
    let countUnobserved = 0;
    const emitter = new EventEmitter<{ change: void, load: void }>();
    emitter.onFirstSubscribed = (id) => firstSubscribeArr.push(id);
    emitter.onLastUnsubscribed = () => countUnobserved++;
    expect(firstSubscribeArr.length).toBe(0);
    expect(countUnobserved).toBe(0);
    emitter.on('load', noop);
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('load');
    expect(countUnobserved).toBe(0);
    emitter.dispose();
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('load');
    expect(countUnobserved).toBe(1);

    emitter.on('change', noop2);
    expect(firstSubscribeArr.length).toBe(2);
    expect(firstSubscribeArr[0]).toBe('load');
    expect(firstSubscribeArr[1]).toBe('change');
    expect(countUnobserved).toBe(1);
    emitter.dispose();
    expect(firstSubscribeArr.length).toBe(2);
    expect(firstSubscribeArr[0]).toBe('load');
    expect(firstSubscribeArr[1]).toBe('change');
    expect(countUnobserved).toBe(2);
  });

  test(`onFirstSubscribe, onUnobserved: add multi event -> dispose`, () => {
    let firstSubscribeArr: any[] = [];
    let countUnobserved = 0;
    const emitter = new EventEmitter<{ change: void, load: void }>();
    emitter.onFirstSubscribed = (id) => firstSubscribeArr.push(id);
    emitter.onLastUnsubscribed = () => countUnobserved++;
    expect(firstSubscribeArr.length).toBe(0);
    expect(countUnobserved).toBe(0);
    emitter.on('load', noop);
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('load');
    expect(countUnobserved).toBe(0);
    emitter.on('load', noop2);
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('load');
    expect(countUnobserved).toBe(0);
    emitter.on('change', noop2);
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('load');
    expect(countUnobserved).toBe(0);
    emitter.dispose();
    expect(firstSubscribeArr.length).toBe(1);
    expect(firstSubscribeArr[0]).toBe('load');
    expect(countUnobserved).toBe(1);
  });

});
