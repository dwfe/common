import {colorLinearlyInterpolated} from '../color-linearly-interpolated';
import {IColorLegendList, IRgba} from '../contract';
import {rgbaToString} from '../rgba-to-string';
import {isSomethingANumber} from '../../type';

const getTransparent = (): IGetColor => ({
  rgba: {r: 0, g: 0, b: 0, a: 0},
  rgbaStr: 'rgba(0, 0, 0, 0)',
});

/**
 * Обертка над списком соответствий: Цвет <-> Значение
 * Может вычислить цвет для запрашиваемого значения,
 * находящегося в диапазоне значений палитры.
 */
export class BaseColorLegendPalette {

  list: IColorLegendList<IRgba>;

  // вернуть граничное значение,
  // если тестируемое значение выходит за границу
  returnBoundaryIfOutsideBorders: boolean;

  constructor(legend: IColorLegendList<IRgba>,
              returnBoundaryIfOutsideBorders = false) {
    this.list = legend;
    this.returnBoundaryIfOutsideBorders = returnBoundaryIfOutsideBorders;
  }

  getColor(value: number, alpha?: number): IGetColor {
    if (!isSomethingANumber(value))
      return getTransparent();

    for (let i = 1; i < this.list.length; i++) {
      const item1 = this.list[i - 1];
      const item2 = this.list[i];

      const isValueBetween = (
        value >= item1.value! &&
        value <= item2.value!
      );
      if (!isValueBetween) continue;

      const res = colorLinearlyInterpolated(
        value,
        item1.value!,
        item1.color,
        item2.value!,
        item2.color,
        alpha,
      );

      return {
        rgba: res,
        rgbaStr: rgbaToString(res),
      }
    }

    // Тестируемое значение находится вне диапазона значений палитры
    if (this.returnBoundaryIfOutsideBorders) {
      const first = this.list[0];
      if (value < first.value!) {
        return {
          rgba: first.color,
          rgbaStr: rgbaToString(first.color),
        };
      }
      const last = this.list.at(-1)!;
      if (value > last.value!) {
        return {
          rgba: last.color,
          rgbaStr: rgbaToString(last.color),
        };
      }
    }

    // вернуть прозрачный цвет
    return getTransparent();
  }

}

interface IGetColor {
  rgba: IRgba;
  rgbaStr: string;
}
