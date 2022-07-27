export function getPropDescriptor(obj: any, prop: string | symbol): PropertyDescriptor {
  let descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (descriptor) {
    return descriptor;
  }
  descriptor = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(obj), prop
  );
  if (!descriptor) {
    const message = `cannot get property descriptor "${String(prop)}"`;
    console.error(message, obj);
    throw new Error(message);
  }
  return descriptor;
}
