export function getOwnPropDescriptor(obj: any, prop: string | symbol): PropertyDescriptor {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (!descriptor) {
    const message = `cannot get own property descriptor "${String(prop)}"`;
    console.error(message, obj);
    throw new Error(message);
  }
  return descriptor;
}
