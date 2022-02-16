import {isNotJustObject} from './is-just-object';
import {IEqualityOpt} from './contract';

/**
 *
 */
export function equality(a: any, b: any, opt: IEqualityOpt = {}): boolean {
  if (opt.nullEqualsUndefined) {
    switch (typeof a) {
      case 'object':    // equality a{object | null | undefined} and b{any}
      case 'undefined':
        if (a == null && b == null) // IF both a and b are null/undefined
          return true;
        if (a == null || b == null) // IF either only a or only b is null/undefined
          return false;
        if (typeof b !== 'object')
          return false; // equality a{object} and b{boolean | number | bigint | string | symbol | function}
        break;
      default:
        return a === b; // equality a{boolean | number | bigint | string | symbol | function} and b{any}
    }
  } else {
    if (isNotJustObject(a))
      return a === b; // equality a{undefined | null | boolean | number | bigint | string | symbol | function} and b{any}
    else if (isNotJustObject(b))
      return false;  // equality a{object} and b{undefined | null | boolean | number | bigint | string | symbol | function}
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
    return arrayEquality(a, b, opt);
  else if (aIsArr || bIsArr)
    return false;

  const aIsSet = a instanceof Set;
  const bIsSet = b instanceof Set;
  if (aIsSet && bIsSet)
    return setEquality(a, b);
  else if (aIsSet || bIsSet)
    return false;

  const aIsMap = a instanceof Map;
  const bIsMap = b instanceof Map;
  if (aIsMap && bIsMap)
    return mapEquality(a, b, opt);
  else if (aIsMap || bIsMap)
    return false;

  return objectEquality(a, b, opt);
}

function arrayEquality(a: any[], b: any[], opt: IEqualityOpt): boolean {
  if (a.length !== b.length)
    return false;
  if (opt.sortArrays) {
    a = [...a].sort();
    b = [...b].sort();
  }
  return a.every((ai, i) => equality(ai, b[i], opt));
}

function setEquality(a: Set<any>, b: Set<any>): boolean {
  if (a.size !== b.size)
    return false;
  for (const value of a) {
    if (!b.has(value))
      return false;
  }
  return true;
}

function mapEquality(a: Map<any, any>, b: Map<any, any>, opt: IEqualityOpt): boolean {
  if (a.size !== b.size)
    return false;
  for (const [aKey, aValue] of a.entries()) {
    if (!b.has(aKey))
      return false;
    if (!equality(aValue, b.get(aKey), opt))
      return false;
  }
  return true;
}

function objectEquality(a: any, b: any, opt: IEqualityOpt): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length)
    return false;
  for (const aKey of aKeys) {
    if (!bKeys.includes(aKey))
      return false;
    if (!equality(a[aKey], b[aKey], opt))
      return false;
  }
  return true;
}
