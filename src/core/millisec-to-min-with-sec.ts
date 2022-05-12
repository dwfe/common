export function millisecToMinWithSec(milliseconds: number): { minutes: number; seconds: number } {
  let seconds = +((milliseconds % 60_000) / 1000).toFixed(0);
  let minutes = Math.floor(milliseconds / 60_000);
  if (seconds === 60) {
    seconds = 0;
    minutes++;
  }
  return {minutes, seconds};
}

export function strMillisecToMinWithSec(milliseconds: number): string {
  const {minutes, seconds} = millisecToMinWithSec(milliseconds);
  let result: string[] = [];
  if (minutes > 0)
    result.push(`${minutes} min`);
  if (seconds > 0) {
    if (minutes > 0)
      result.push(`${seconds} sec`);
    else
      result.push(`${seconds} sec`);
  }
  if (minutes === 0 && seconds === 0) {
    result.push(`${milliseconds} ms`);
  }
  return result.join(' ');
}
