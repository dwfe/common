export function isPrimitiveTypeWrapper(ctor: any): boolean {
  switch (ctor) {
    case Boolean:
    case Number:
    case BigInt:
    case String:
    case Symbol:
      return true;
    default:
      return false;
  }
}
