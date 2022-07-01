export const nextTick = (function () {
  const {process} = Function('return this;')();
  if (process &&
    process.toString() == '[object process]' &&
    process.nextTick) {
    return process.nextTick;
  }
  return (cb: any) => {
    queueMicrotask(cb);
  };
})();
