import {hexChars} from '../constant';

/**
 * Случайная строка из 32 символов из диапазона [0-9] и [a-f], разделенных четырмя символами '-':
 *    "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
 * Total length: 36.
 * Не является точной реализацией UUID(он же GUID): https://www.ietf.org/rfc/rfc4122.txt
 * Для точной реализации наверное лучше использовать пакет: https://github.com/uuidjs/uuid
 * А есть еще и ulid: https://github.com/ulid/javascript
 */
export function guid(): string {
  let result = '';
  const {length} = hexChars;
  for (let i = 0; i < 36; i++) {
    result += (i === 8 || i === 13 || i === 18 || i === 23)
      ? '-'
      : hexChars[Math.floor(Math.random() * length)];
  }
  return result;
}
