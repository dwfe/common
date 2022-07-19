export const nextTick = (function () {
  const {process} = globalThis as any;
  if (process &&
    process.toString() == '[object process]' &&
    process.nextTick) {
    return process.nextTick;
  }
  return (cb: any) => {
    queueMicrotask(cb);
  };
})();
