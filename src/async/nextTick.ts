export const nextTick: (callback: any) => void = (function () {
  const {process} = globalThis as any;
  if (process &&
    process.toString() === '[object process]' &&
    process.nextTick) {
    return process.nextTick;
  }
  return queueMicrotask;
})();
