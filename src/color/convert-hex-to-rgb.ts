import {IColorLegendItem, IColorLegendList, IRgba} from './contract';
import {hexToRgb} from './hex-to-rgb';

export function convertHexToRgb(legend: IColorLegendList<string>): IColorLegendList<IRgba> {
  const blackColor: IRgba = {r: 0, g: 0, b: 0, a: 1};
  const result: IColorLegendList<IRgba> = [];

  for (const item of legend) {
    const hex = item.color;
    const next = {...item} as unknown as IColorLegendItem<IRgba>;
    next.color = hexToRgb(hex) || blackColor;
    result.push(next);
  }
  return result;
}
