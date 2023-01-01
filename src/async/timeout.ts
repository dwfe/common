export function timeout<T = any>(ms: number, promise: Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const rejectTimer = setTimeout(() => reject(new Error('TIMEOUT')), ms);
    promise.then(value => {
      clearTimeout(rejectTimer);
      resolve(value);
    }).catch(reason => {
      clearTimeout(rejectTimer);
      reject(reason);
    });
  });
}
