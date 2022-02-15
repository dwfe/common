import {isNotJustObject} from './is-just-object';

export function compare(a: any, b: any): boolean {
  if (isNotJustObject(a) || isNotJustObject(b))
    return a === b;
  if (a === b)
    return true;
  if (a.equals && b.equals)
    return a.equals(b);

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

  return compareObjects(a, b);
}

function compareArrays(a: any[], b: any[]): boolean {
  if (a.length !== b.length)
    return false;
  a = [...a].sort();
  b = [...b].sort()
  return a.every((ai, i) => compare(ai, b[i]));
}

function compareSets(a: Set<any>, b: Set<any>): boolean {
  if (a.size !== b.size)
    return false;
  for (const value of a) {
    if (!b.has(value))
      return false;
  }
  return true;
}

function compareMaps(a: Map<any, any>, b: Map<any, any>): boolean {
  if (a.size !== b.size)
    return false;
  for (const [aKey, aValue] of a.entries()) {
    if (!b.has(aKey))
      return false;
    if (!compare(aValue, b.get(aKey)))
      return false;
  }
  return true;
}

function compareObjects(a: any, b: any): boolean {
  const aEntries = Object.entries(a);
  const bKeys = Object.keys(b);
  if (aEntries.length !== bKeys.length)
    return false;
  for (const [aKey, aValue] of aEntries) {
    if (!bKeys.includes(aKey))
      return false;
    if (!compare(aValue, b[aKey]))
      return false;
  }
  return true;
}
