import {DateTime, Duration} from 'luxon';
import {TChecks} from '../checks';

export function builtinEquals(): TChecks {
  const date1 = DateTime.now();
  const duration1 = Duration.fromObject({minutes: 360, milliseconds: 10, year: 2022});

  return [
    [date1, DateTime.fromISO(date1.toISO()), true],
    [duration1, Duration.fromISO(duration1.toISO()), true],
    [date1, duration1, false]
  ];
}
