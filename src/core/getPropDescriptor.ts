export function getPropDescriptor(obj: any, prop: string | symbol): PropertyDescriptor {
  let descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (descriptor) {
    return descriptor;
  }
  const proto = Object.getPrototypeOf(obj);
  descriptor = Object.getOwnPropertyDescriptor(proto, prop);
  if (!descriptor) {
    const message = `cannot get property descriptor "${String(prop)}"`;
    console.error(message, obj);
    throw new Error(message);
  }
  return descriptor;
}
