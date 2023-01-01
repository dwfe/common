export function assert(result: any, message = 'Assertion failed') {
  if (!result)
    throw new Error(message);
}
