import {IEqualityCheckOpt} from './contract';

/**
 * Checks two values for equality.
 * Object check supported: built-in objects check for equality (method 'equals'), array, Set, Map, any object.
 *
 * Restrictions for: Set, Map.
 * A correct comparison can be expected:
 *   - if Set contains only primitives;
 *   - if Map keys consist only of primitives.
 */
export function isEqual(a: any, b: any, opt?: IEqualityCheckOpt): boolean {
  if (opt && opt.isNullEqualsUndefined) {
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
        return Object.is(a, b); // a{boolean | number | bigint | string | symbol | function} and b{any}
    }
  } else {
    if (typeof a !== 'object' || a === null) // isNotJustObject(a)
      return Object.is(a, b); // a{undefined | null | boolean | number | bigint | string | symbol | function} and b{any}
    if (typeof b !== 'object' || b === null) // isNotJustObject(b)
      return false;  // a{object} and b{undefined | null | boolean | number | bigint | string | symbol | function}
  }
  /**
   * from here and below both a and b are objects
   */
  if (a === b)
    return true;
  if (a.equals && b.equals)
    return a.equals(b);

  const aIsArr = Array.isArray(a);
  const bIsArr = Array.isArray(b);
  if (aIsArr && bIsArr)
    return arraysEqual(a, b, opt);
  else if (aIsArr || bIsArr)
    return false;

  const aIsSet = a instanceof Set;
  const bIsSet = b instanceof Set;
  if (aIsSet && bIsSet)
    return setsEqual(a, b);
  else if (aIsSet || bIsSet)
    return false;

  const aIsMap = a instanceof Map;
  const bIsMap = b instanceof Map;
  if (aIsMap && bIsMap)
    return mapsEqual(a, b, opt);
  else if (aIsMap || bIsMap)
    return false;

  return objectsEqual(a, b, opt);
}


//region Equality checks

function arraysEqual(a: any[], b: any[], opt?: IEqualityCheckOpt): boolean {
  if (a.length !== b.length)
    return false;
  if (opt && opt.sortArrays) {
    a = [...a].sort();
    b = [...b].sort();
  }
  return a.every((ai, i) => isEqual(ai, b[i], opt));
}

function setsEqual(a: Set<any>, b: Set<any>): boolean {
  if (a.size !== b.size)
    return false;
  for (const value of a) {
    if (!b.has(value))
      return false;
  }
  return true;
}

function mapsEqual(a: Map<any, any>, b: Map<any, any>, opt?: IEqualityCheckOpt): boolean {
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

function objectsEqual(a: any, b: any, opt?: IEqualityCheckOpt): boolean {
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
