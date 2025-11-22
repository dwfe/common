import {hexToRgb, IRgba, untransparentize} from '../../color';

describe('untransparentize', () => {

  function match(color: IRgba, match: IRgba) {
    expect(color.a).toBe(1)
    expect(color.r).toBeLessThanOrEqual(match.r + 1)
    expect(color.r).toBeGreaterThanOrEqual(match.r - 1)

    expect(color.g).toBeLessThanOrEqual(match.g + 1)
    expect(color.g).toBeGreaterThanOrEqual(match.g - 1)

    expect(color.b).toBeLessThanOrEqual(match.b + 1)
    expect(color.b).toBeGreaterThanOrEqual(match.b - 1)
  }

  test('should be equal to dom div composite within += 1. White background', () => {
    match(untransparentize({r: 255, g: 0, b: 0, a: .5}, 'white'), {r: 255, b: 127, g: 127, a: 1})
    match(untransparentize({r: 135, g: 155, b: 54, a: .7}, 'white'), {r: 0xab, g: 0xb9, b: 0x72, a: 1})
    match(untransparentize({r: 135, g: 155, b: 54, a: .2}, 'white'), {r: 0xe7, g: 0xeb, b: 0xd7, a: 1})
  })

  test('should be equal to dom div composite within += 1. Black background', () => {
    match(untransparentize({r: 255, g: 0, b: 0, a: .5}, 'black'), {r: 0x80, b: 0, g: 0, a: 1})
    match(untransparentize({r: 135, g: 155, b: 54, a: .7}, 'black'), {r: 0x5f, g: 0x6d, b: 0x26, a: 1})
    match(untransparentize({r: 135, g: 155, b: 54, a: .2}, 'black'), {r: 0x1b, g: 0x1f, b: 0x0b, a: 1})
  })

  test('should be equal to dom div composite within += 1. Custom background', () => {
    const custom: IRgba = {r: 43, g: 172, b: 31, a: 1}
    match(untransparentize({r: 255, g: 0, b: 0, a: .5}, custom), hexToRgb('#95560f')!)
    match(untransparentize({r: 135, g: 155, b: 54, a: .7}, custom), hexToRgb('#6ca02f')!)
    match(untransparentize({r: 135, g: 155, b: 54, a: .2}, custom), hexToRgb('#3da924')!)
  })


})
