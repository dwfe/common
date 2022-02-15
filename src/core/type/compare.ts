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
  else if (aIsArr || bIsArr)
    return false;

  const aIsSet = a instanceof Set;
  const bIsSet = b instanceof Set;
  if (aIsSet && bIsSet)
    return compareSets(a, b);
  else if (aIsSet || bIsSet)
    return false;

  const aIsMap = a instanceof Map;
  const bIsMap = b instanceof Map;
  if (aIsMap && bIsMap)
    return compareMaps(a, b);
  else if (aIsMap || bIsMap)
    return false;

  if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.getOwnPropertyNames(a);
    const bKeys = Object.getOwnPropertyNames(b);
    return compareArraysOfPrimitives(aKeys, bKeys)
      && aKeys.every(key => compare(a[key], b[key], equalsFnName))
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

function compareSets(a: Set<any>, b: Set<any>): boolean {
  return a.size === b.size
    && compareArrays(Array.from(a).sort(), Array.from(b).sort());
}

function compareMaps(a: Map<any, any>, b: Map<any, any>): boolean {
  if (a.size !== b.size)
    return false;
  const aKeys = Array.from(a.keys()).sort();
  const bKeys = Array.from(b.keys()).sort();
  return compareArrays(aKeys, bKeys)
    && aKeys.every((aKey, i) =>
      compare(a.get(aKey), b.get(bKeys[i]))
    );
}
