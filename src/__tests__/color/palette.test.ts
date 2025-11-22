import '@do-while-for-each/test'
import {ColorLegendPalette, hexToRgb, IColorLegendList} from '../../color';
import {rgbaToString} from '../../color/rgba-to-string';

const legend = [
  {color: '#e8d0e8', value: -60},
  {color: '#3030b4', value: -22},
  {color: '#4cbe67', value: 2},
  {color: '#dede23', value: 20},
  {color: '#ac1616', value: 52},
] as IColorLegendList;

describe('palette', () => {

  test('getColor, returnBoundaryIfOutsideBorders', () => {
    let palette = new ColorLegendPalette(legend, true);

    let res = palette.getColor(-22);
    expect(rgbaToString(hexToRgb('#3030b4')!)).eq(res.rgbaStr);

    res = palette.getColor(52);
    expect(rgbaToString(hexToRgb('#ac1616')!)).eq(res.rgbaStr);

    // значение меньше минимальной границы
    res = palette.getColor(-61);
    // мапится на минимальную границу
    expect(rgbaToString(hexToRgb('#e8d0e8')!)).eq(res.rgbaStr);

    res = palette.getColor(-61);
    expect(rgbaToString(hexToRgb('#aaabbb')!)).not.eq(res.rgbaStr);

    // значение больше максимальной границы
    res = palette.getColor(53);
    // мапится на максимальную границу
    expect(rgbaToString(hexToRgb('#ac1616')!)).eq(res.rgbaStr);

    res = palette.getColor(53);
    expect(rgbaToString(hexToRgb('#dddfff')!)).not.eq(res.rgbaStr);


    // returnBoundaryIfOutsideBorders = false
    palette = new ColorLegendPalette(legend);

    res = palette.getColor(-61);
    expect('rgba(0, 0, 0, 0)').eq(res.rgbaStr);

    res = palette.getColor(53);
    expect('rgba(0, 0, 0, 0)').eq(res.rgbaStr);

    res = palette.getColor(10);
    expect('rgba(140.88888888888889, 204.22222222222223, 72.77777777777777, 1)').eq(res.rgbaStr);

  });

});
