import {BaseColorLegendPalette} from './base.color-legend.palette';
import {IColorLegendList, IRgba} from '../contract';
import {hexToRgb} from '../hex-to-rgb';

/**
 * Когда есть список цветов в hex представлении,
 * но заранее неизвестны значения,
 * поставленные этим цветам в соответствие.
 */
export class CalculateValuesPalette extends BaseColorLegendPalette {

  constructor(colorList: string[]) {
    // список цветов ожидается в hex представлении
    super(prepareLegend(colorList));
  }

  /**
   * Список цветов мы передали при поднятии инстенса.
   * Теперь настало время определить значения для этих цветов.
   * Значение min для первого цвета в списке.
   * Значение max для последнего цвета в списке.
   * Значения для цветов между первым и последним вычисляется при помощи пропорции.
   */
  calculateValues(min: number, max: number) {
    if (min > max) return;
    const {list} = this;
    if (list.length === 0) return;
    if (list.length === 1) {
      this.list[0].value = min;
      return;
    }
    this.list[0].value = min;
    const step = (max - min) / (this.list.length - 1);
    for (let i = 1; i < this.list.length - 1; i++) {
      const item = this.list[i];
      item.value = min + step * i;
    }
    this.list.at(-1)!.value = max;
  }

}


function prepareLegend(colorList: string[]): IColorLegendList<IRgba> {
  const res: IColorLegendList<IRgba> = [];
  for (const color of colorList) {
    const rgb = hexToRgb(color);
    if (rgb)
      res.push({color: rgb})
  }
  return res;
}
