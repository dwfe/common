import '@do-while-for-each/test';
import {ObsValueLike} from '../../core/event-emitter';

export function checkSupport(arr: ObsValueLike, numberOfIds: number, hasListeners: boolean, numberOfListeners?: number) {
  expect(arr.numberOfIds).eq(numberOfIds);
  expect(arr.hasListeners).eq(hasListeners);
  if (numberOfListeners !== undefined)
    expect(arr.numberOfListeners()).eq(numberOfListeners);
}
