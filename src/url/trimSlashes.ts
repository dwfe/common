/**
 * Убирает все ведущие и заканчивающие слэши
 */
export function trimSlashes(str: string) {
  str = str.replace(/^\/+/, '');
  str = str.replace(/\/+$/, '');
  return str;
}
