export {delayAsync, timeout} from './core/async';
export {divideWithoutRemainder} from './core/math';
export {PropType, getPropDescriptor, recognizePropType} from './core/object';
export {
  isEqual, IEqualityCheckOpt, isJustObject, isNotJustObject,
  isPrimitive, isNotPrimitive, isPrimitiveTypeWrapper,
  isFunction, isNumber, isNumberStrict, isString
} from './core/type';
export * from './core/url';
export {cloneSimple} from './core/clone-simple';
export {Type, IStoppable, TRunMode, TAnyObject} from './core/contract';
export {getExecFunctionName} from './core/getExecFunctionName';
export {guid} from './core/guid';
export {millisecToMinWithSec, strMillisecToMinWithSec} from './core/millisec-to-min-with-sec';
export {nextTick} from './core/next-tick';
export {EventEmitter, Listener} from './core/event-emitter';
export {IObsArray, createObsArray, ObsArrayChangeEventListenerParam} from './core/event-emitter';
export {IObsMap,createObsMap, ObsMapChangeEventListenerParam} from './core/event-emitter';
export {rAFQueueLast} from './core/raf-queue-last';
