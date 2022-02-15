export function isPrimitive(value: any): boolean {
  if (value === null)
    return true;
  const type = typeof value;
  return type !== 'object' && type !== 'function';
}

export function isNotPrimitive(value: any): boolean {
  const type = typeof value;
  return type === 'object' && value !== null || type === 'function';
}
