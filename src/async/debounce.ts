/**
 * https://github.com/jashkenas/underscore/blob/master/modules/debounce.js
 * 8 Dec 2020
 */
export function debounce(func: Function, wait: number, immediate = false) {
  let timeout: any, previous: number, args: any[], result: any, context: any;

  const later = function () {
    const passed = +new Date() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
      }
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!timeout) {
        args = context = null as any;
      }
    }
  };

  const debounced = function (this: any, ..._args: any[]) {
    context = this;
    args = _args;
    previous = +new Date();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) {
        result = func.apply(context, args);
      }
    }
    return result;
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = args = context = null as any;
  };

  return debounced;
}
