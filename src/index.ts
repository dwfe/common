export {delayAsync, timeout} from './core/async';
export {divideWithoutRemainder} from './core/math';
export {
  isEqual, IEqualityCheckOpt, isJustObject, isNotJustObject,
  isPrimitive, isNotPrimitive, isPrimitiveTypeWrapper,
  isFunction, isNumber, isString
} from './core/type';
export * from './core/url';
export {cloneSimple} from './core/clone-simple';
export {Type, IStoppable, TRunMode, TAnyObject} from './core/contract';
export {guid} from './core/guid';
export {millisecToMinWithSec} from './core/millisec-to-min-with-sec';
export {NodeEventEmitter} from './core/node.event-emitter';
export {rAFQueueLast} from './core/raf-queue-last';
