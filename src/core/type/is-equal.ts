import {isNotJustObject} from './is-just-object';
import {IEqualityCheckOpt} from './contract';

/**
 * Checks two values for equality.
 * Object check supported: built-in object validation (methods 'equals', 'isEqual'), array, Set, Map.
 *
 * Restrictions for: Set, Map.
 * A correct comparison can be expected:
 *   - if Set contains only primitives;
 *   - if Map keys consist only of primitives.
 */
export function isEqual(a: any, b: any, opt: IEqualityCheckOpt = {}): boolean {
  if (opt.nullEqualsUndefined) {
    switch (typeof a) {
      case 'object':    // a{object | null | undefined} and b{any}
      case 'undefined':
        if (a == null && b == null) // IF both a and b are null/undefined
          return true;
        if (a == null || b == null) // IF either only a or only b is null/undefined
          return false;
        if (typeof b !== 'object')
          return false; // a{object} and b{boolean | number | bigint | string | symbol | function}
        break;
      default:
        return a === b; // a{boolean | number | bigint | string | symbol | function} and b{any}
    }
  } else {
    if (isNotJustObject(a))
      return a === b; // a{undefined | null | boolean | number | bigint | string | symbol | function} and b{any}
    else if (isNotJustObject(b))
      return false;  // a{object} and b{undefined | null | boolean | number | bigint | string | symbol | function}
  }
  /**
   * from here and below both a and b are objects
   */
  if (a === b)
    return true;
  const equalsMethodName = getEqualsMethodName(a, b);
  if (equalsMethodName)
    return a[equalsMethodName](b);

  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr && bIsArr)
    return areArrayEqual(a, b, opt);
  else if (aIsArr || bIsArr)
    return false;

  const aIsSet = a instanceof Set;
  const bIsSet = b instanceof Set;
  if (aIsSet && bIsSet)
    return areSetsEqual(a, b);
  else if (aIsSet || bIsSet)
    return false;

  const aIsMap = a instanceof Map;
  const bIsMap = b instanceof Map;
  if (aIsMap && bIsMap)
    return areMapsEqual(a, b, opt);
  else if (aIsMap || bIsMap)
    return false;

  return areObjectsEqual(a, b, opt);
}


//region Equality checks

function areArrayEqual(a: any[], b: any[], opt: IEqualityCheckOpt): boolean {
  if (a.length !== b.length)
    return false;
  if (opt.sortArrays) {
    a = [...a].sort();
    b = [...b].sort();
  }
  return a.every((ai, i) => isEqual(ai, b[i], opt));
}

function areSetsEqual(a: Set<any>, b: Set<any>): boolean {
  if (a.size !== b.size)
    return false;
  for (const value of a) {
    if (!b.has(value))
      return false;
  }
  return true;
}

function areMapsEqual(a: Map<any, any>, b: Map<any, any>, opt: IEqualityCheckOpt): boolean {
  if (a.size !== b.size)
    return false;
  for (const [aKey, aValue] of a.entries()) {
    if (!b.has(aKey))
      return false;
    if (!isEqual(aValue, b.get(aKey), opt))
      return false;
  }
  return true;
}

function areObjectsEqual(a: any, b: any, opt: IEqualityCheckOpt): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length)
    return false;
  for (const aKey of aKeys) {
    if (!bKeys.includes(aKey))
      return false;
    if (!isEqual(a[aKey], b[aKey], opt))
      return false;
  }
  return true;
}

//endregion

function getEqualsMethodName(a: any, b: any): 'equals' | 'isEqual' | undefined {
  if (a.equals && b.equals)
    return 'equals';
  if (a.isEqual && b.isEqual)
    return 'isEqual';
}
