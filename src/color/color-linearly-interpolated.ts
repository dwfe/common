import {IRgba} from './contract';

/**
 * Вычислить цвет для значения при помощи линейной интерполяции.
 *
 * Есть два значения: value1 < value2.
 * Значению value1 поставлен в соответствие цвет color1.
 * Значению value2 поставлен в соответствие цвет color2.
 * Требуется вычислить цвет для значения betweenValue:
 *        value1 <= betweenValue <= value2
 */
export function colorLinearlyInterpolated(
  betweenValue: number,
  value1: number,
  color1: IRgba,
  value2: number,
  color2: IRgba,
  alpha?: number,
): IRgba {
  const percent = (betweenValue - value1) / (value2 - value1);
  switch (percent) {

    // На правом краю.
    case 0:
      return {...color1};

    // На левом краю.
    case 100:
      return {...color2};

    // Между краями => нужна интерполяция.
    default:
      return {
        r: color1.r + percent * (color2.r - color1.r),
        g: color1.g + percent * (color2.g - color1.g),
        b: color1.b + percent * (color2.b - color1.b),
        a: alpha ? alpha :
          color1.a + percent * (color2.a - color1.a),
      };

  }
}
