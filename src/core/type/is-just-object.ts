/**
 * It's just an object - object doesn't implement [[Call]] - when it's of type "object" and it's not null.
 * See description of bug “typeof null”: https://2ality.com/2013/10/typeof-null.html
 */
export const isJustObject = (value: any): boolean =>
  typeof value === 'object' && value !== null
;

/**
 * It's not just an object when it's one of:
 *   - undefined
 *   - null
 *   - boolean
 *   - number
 *   - bigint
 *   - string
 *   - symbol
 *   - object implements [[Call]] - function
 */
export const isNotJustObject = (value: any): boolean =>
  typeof value !== 'object' || value === null
;
