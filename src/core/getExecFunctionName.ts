/**
 * Get the name of the function that is currently executing.
 */
export function getExecFunctionName(args: IArguments): string | undefined {
  try {
    return args?.callee?.name;
  } catch (ignored) {
  }
}
