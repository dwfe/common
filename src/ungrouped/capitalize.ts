/**
 * Приводит к верхнему регистру строку или её часть
 * (По умолчанию первый символ строки)
 *
 * @param s
 * @param options {quantity?: number, from?: number} если quantity === 0, то до конца  строки от from.
 * Quantity должен быть больше нуля
 */
export function capitalize(s: string, options?: { quantity?: number, from?: number }) {
  let quantity = Math.max(options?.quantity ?? 1, 0)
  let from = 0

  if (options?.from) {
    if (options.from < 0) {
      from = s.length + options.from
    } else {
      from = options.from
    }
  }

  const theRest = quantity === 0
  const startPart = s.slice(0, from)
  let capitalizedPart = s.slice(from, theRest ? undefined : (from + quantity))
  return `${startPart}${capitalizedPart.toUpperCase()}${theRest ? '' : s.slice(from + quantity)}`
}
