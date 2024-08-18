const hexCharacters = 'a-f\\d';
const match3or4Hex = `#?[${hexCharacters}]{3}[${hexCharacters}]?`;
const match6or8Hex = `#?[${hexCharacters}]{6}([${hexCharacters}]{2})?`;
const nonHexChars = new RegExp(`[^#${hexCharacters}]`, 'gi');
const validHexSize = new RegExp(`^${match3or4Hex}$|^${match6or8Hex}$`, 'i');

/**
 * https://github.com/sindresorhus/hex-rgb
 */
export function hexToRgb(hex: string, options: IOptions = {}): IRgba | undefined {
  if (typeof hex !== 'string' || nonHexChars.test(hex) || !validHexSize.test(hex)) {
    return;
  }

  hex = hex.replace(/^#/, '');
  let alphaFromHex = 1;

  if (hex.length === 8) {
    alphaFromHex = Number.parseInt(hex.slice(6, 8), 16) / 255;
    hex = hex.slice(0, 6);
  }

  if (hex.length === 4) {
    alphaFromHex = Number.parseInt(hex.slice(3, 4).repeat(2), 16) / 255;
    hex = hex.slice(0, 3);
  }

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const number = Number.parseInt(hex, 16);
  const red = number >> 16;
  const green = (number >> 8) & 255;
  const blue = number & 255;
  const alpha = typeof options.alpha === 'number' ? options.alpha : alphaFromHex;

  return {red, green, blue, alpha};
}

interface IOptions {
  alpha?: number;
}

export interface IRgba {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}
