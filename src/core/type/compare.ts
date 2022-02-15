import {isNotJustObject} from './is-just-object';

interface IOptions {
  sortArrays?: boolean; // should arrays be sorted before comparison?

  /**
   * if true, then there is no difference between null and undefined:
   *   compare(null, undefined) -> true
   *   compare(undefined, null) -> true
   */
  nullEqualsUndefined?: boolean;
}

export function compare(a: any, b: any, opt: IOptions = {}): boolean {
  if (opt.nullEqualsUndefined) {

  } else {
    if (isNotJustObject(a) || isNotJustObject(b))
      return a === b;
  }
  if (a === b)
    return true;
  if (a.equals && b.equals)
    return a.equals(b);

  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr && bIsArr)
    return compareArrays(a, b, opt);
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
    return compareMaps(a, b, opt);
  else if (aIsMap || bIsMap)
    return false;

  return compareObjects(a, b, opt);
}

function compareArrays(a: any[], b: any[], opt: IOptions): boolean {
  if (a.length !== b.length)
    return false;
  if (opt.sortArrays) {
    a = [...a].sort();
    b = [...b].sort();
  }
  return a.every((ai, i) => compare(ai, b[i], opt));
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

function compareMaps(a: Map<any, any>, b: Map<any, any>, opt: IOptions): boolean {
  if (a.size !== b.size)
    return false;
  for (const [aKey, aValue] of a.entries()) {
    if (!b.has(aKey))
      return false;
    if (!compare(aValue, b.get(aKey), opt))
      return false;
  }
  return true;
}

function compareObjects(a: any, b: any, opt: IOptions): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length)
    return false;
  for (const aKey of aKeys) {
    if (!bKeys.includes(aKey))
      return false;
    if (!compare(a[aKey], b[aKey], opt))
      return false;
  }
  return true;
}
