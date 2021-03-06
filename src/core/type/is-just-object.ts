/**
 * It's just an object?
 * Object doesn't implement [[Call]] or/and [[Construct]] when it's of type "object" and it's not null.
 *   See description of bug “typeof null”: https://2ality.com/2013/10/typeof-null.html
 *
 * Also keep in mind that:
 *   class Some {}
 *   const instance = new Some();
 *     typeof Some;     // "function"
 *     typeof instance; // "object"
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
 *   - object implements [[Call]] or/and [[Construct]] - function
 */
export const isNotJustObject = (value: any): boolean =>
  typeof value !== 'object' || value === null
;
