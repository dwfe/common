/**
 * Каждый вызов rAF(requestAnimationFrame) добавляет callback в rAF-очередь
 * Перед каждым рендером браузер сначала последовательно исполняет ВСЕ callback'и из rAF-очереди.
 * Почему бы перед рендером не обрабатывать только тот callback, который пришел самым последним?
 * Такой подход уменьшает объем работы перед рендером минимум в 2 раза.
 *
 * Использовать, например, так:
 *   .pipe(
 *     tap(d => this.rAFQueue.push(d)),
 *     delay(0, animationFrameScheduler), // отправить в --> rAF-очередь
 *     map(() => rAFQueueLast(this)), // взять из rAF-очереди только последнюю задачу
 *     filter(x=> !!x),
 *   )
 */
export function rAFQueueLast<T = any>(obj: IExpectedObj<T>): T | undefined {
  const length = obj.rAFQueue.length;
  if (length > 0) {
    const last = obj.rAFQueue[length - 1]; // взять последний callback
    obj.rAFQueue = []; // очистить очередь
    return last;
  }
}

export interface IExpectedObj<T> {
  rAFQueue: T[];
}
