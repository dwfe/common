/**
 * https://github.com/jashkenas/underscore/blob/master/modules/throttle.js
 * 31 Mar 2020
 */
export function throttle(func: Function, wait: number, options: IOpt = {leading: false, trailing: true}) {
  let timeout: any, context: any, args: any[], result: any;
  let previous = 0;

  const later = function () {
    previous = options.leading ? +new Date() : 0;
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) {
      context = args = null as any;
    }
  };

  const throttled = function (this: any, ..._args: any[]) {
    const _now = +new Date();
    if (!previous && !options.leading) {
      previous = _now;
    }
    const remaining = wait - (_now - previous);
    context = this;
    args = _args;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null as any;
      }
    } else if (!timeout && options.trailing) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null as any;
  };

  return throttled;
}

interface IOpt {
  leading: boolean;
  trailing: boolean;
}
