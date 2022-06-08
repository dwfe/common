import {describe, expect} from '@jest/globals';
import {EventEmitter} from '../../core/event-emitter';

function noop() {
}

function noop2() {
}

describe(`event-emitter`, () => {

  test(`subscribe/unsubscribe`, () => {
    const emitter = new EventEmitter<{ change: void, load: void }>();
    expect(emitter.size).toBe(0);
    expect(emitter.hasId('change')).toBe(false);
    expect(emitter.hasId('load')).toBe(false);

    emitter.addListener('change', noop);
    expect(emitter.size).toBe(1);
    emitter.on('load', noop2);
    expect(emitter.size).toBe(2);
    expect(emitter.hasId('change')).toBe(true);
    expect(emitter.hasId('load')).toBe(true);

    emitter.off('change', noop2);
    expect(emitter.size).toBe(2);
    emitter.off('change', noop);
    expect(emitter.size).toBe(1);
    emitter.removeListener('load', noop2);
    expect(emitter.size).toBe(0);
    expect(emitter.hasId('change')).toBe(false);
    expect(emitter.hasId('load')).toBe(false);
    expect(emitter.size).toBe(0);
  });

  test(`return unsubscriber on subscribe`, () => {
    const emitter = new EventEmitter<{ change: void, load: void }>();
    expect(emitter.size).toBe(0);
    let unsubscriber = emitter.on('change', noop);
    expect(emitter.size).toBe(1);
    unsubscriber();
    expect(emitter.size).toBe(0);

    unsubscriber = emitter.addListener('change', noop2);
    expect(emitter.size).toBe(1);
    unsubscriber();
    expect(emitter.size).toBe(0);
  });

  test(`dispose`, () => {
    const emitter = new EventEmitter<{ move: void, drag: void; up: number; }>();
    expect(emitter.size).toBe(0);

    emitter.addListener('move', () => console.log(`move`,));
    emitter.on('drag', () => console.log(`drag`,));
    emitter.on('drag', noop);
    emitter.on('drag', noop2);
    emitter.on('up', noop2);
    expect(emitter.size).toBe(3);

    emitter.dispose();
    expect(emitter.size).toBe(0);
  });

  test(`emit`, () => {
    const count = {change: 0, load: 0,};
    const emitter = new EventEmitter<{ change: void, load: void }>();
    emitter.addListener('change', () => ++count.change);
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


  // test(``, () => {
  //
  //
  // });

});
