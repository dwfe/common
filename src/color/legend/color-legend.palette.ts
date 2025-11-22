import {BaseColorLegendPalette} from './base.color-legend.palette';
import {convertHexToRgb} from '../convert-hex-to-rgb';
import {IColorLegendList} from '../contract';

/**
 * Ожидается, что легенда состоит из цветов в hex представлении.
 */
export class ColorLegendPalette extends BaseColorLegendPalette {

  constructor(legend: IColorLegendList<string>,
              returnBoundaryIfOutsideBorders?: boolean) {
    super(
      convertHexToRgb(legend),
      returnBoundaryIfOutsideBorders
    );
  }

}

