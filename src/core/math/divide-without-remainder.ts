export function divideWithoutRemainder(value: number, by: number): number {
  return (value - value % by) / by;
}
