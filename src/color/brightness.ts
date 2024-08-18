import {IRgba} from './hex-to-rgb';

/**
 * Яркость.
 * Возвращает 0 для rgb(0,0,0) = черного
 * Возвращает 255 для rgb(255,255,255) = белого
 * https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area#11868159
 *
 * Пример, как можно использовать:
 *   Представьте ситуацию у вас на темном фоне рисуется текст темным шрифтом.
 *   В таком случае текст будет либо плохо различим, либо совсем не различим.
 *   Для решения проблемы цвет текста можно определять так:
 *       getBrightness(bgColorRGB) > 100 ? 'black' : 'white'
 *       если яркость ФОНА ближе к белому, тогда цвет ТЕКСТА сделать черным и наоборот.
 */
export function getBrightness({red, green, blue}: IRgba): number {
  return Math.round((
    red * 299 +
    green * 587 +
    blue * 114
  ) / 1000);
}
