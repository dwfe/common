import {isNotJustObject} from './is-just-object';

export function compare(a: any, b: any, equalsFnName = 'isEquals'): boolean {
  if (isNotJustObject(a) || isNotJustObject(b))
    return a === b;
  if (a === b)
    return true;
  if (a[equalsFnName] && b[equalsFnName])
    return a[equalsFnName](b);

  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr && bIsArr)
    return compareArrays(a, b);
  else if (aIsArr && !bIsArr || !aIsArr && bIsArr)
    return false;

  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.getOwnPropertyNames(a);
    const bKeys = Object.getOwnPropertyNames(b);
    if (!compareArraysOfPrimitives(aKeys, bKeys))
      return false;
    return aKeys.every(key => compare(a[key], b[key], equalsFnName));
  }
  return false;
}

function compareArrays(a: any[], b: any[]): boolean {
  return a.length === b.length
    && a.every((ai, i) => compare(ai, b[i]));
}

function compareArraysOfPrimitives(a: any[], b: any[]): boolean {
  return a.length === b.length
    && a.every((ai, i) => ai === b[i]);
}
