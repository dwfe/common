export function isObsValueLike(data: any): boolean {
  for (const prop of ['on', 'off', 'dispose', 'hasListeners', 'numberOfIds', 'numberOfListeners']) {
    if (!data[prop] || typeof data[prop] !== 'function')
      return false;
  }
  return true;
}
