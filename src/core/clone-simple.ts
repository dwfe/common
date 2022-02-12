export const cloneSimple = <T = any>(obj: T): T =>
  obj === undefined
    ? undefined
    : JSON.parse(JSON.stringify(obj))
;
