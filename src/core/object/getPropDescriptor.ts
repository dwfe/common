export function getPropDescriptor(obj: any, prop: string | symbol): PropertyDescriptor {
  let desc;
  do {
    desc = Object.getOwnPropertyDescriptor(obj, prop);
  } while (
    !desc &&
    (obj = Object.getPrototypeOf(obj))
    );

  if (!desc) {
    const message = `cannot get property descriptor "${String(prop)}"`;
    console.error(message, obj);
    throw new Error(message);
  }
  return desc;
}
