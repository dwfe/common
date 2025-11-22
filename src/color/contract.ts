export interface IRgba {
  r: number; // red
  g: number; // green
  b: number; // blue
  a: number; // alpha
}

// Список цветов с дополнительной информацией.
export type IColorLegendList<TColor = any> = IColorLegendItem<TColor>[];

// К цвету можно привязать различную информацию.
export interface IColorLegendItem<TColor = string> {
  color: TColor; // Цвет: '#fff', 'black', '#ac00de', и т.п.
  value?: number; // Значение, соответствующее цвету (опционально)
  desc?: { ru: string; en: string }, // Description (опционально)
}
