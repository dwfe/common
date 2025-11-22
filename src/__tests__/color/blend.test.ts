import {hexToRgb, IRgba} from '../../color';
import {blend} from '../../color/blend';

describe('blend', () => {

  function match(color: IRgba, equalTo: IRgba) {
    expect(color.r).toBeLessThanOrEqual(equalTo.r + 1)
    expect(color.r).toBeGreaterThanOrEqual(equalTo.r - 1)

    expect(color.g).toBeLessThanOrEqual(equalTo.g + 1)
    expect(color.g).toBeGreaterThanOrEqual(equalTo.g - 1)

    expect(color.b).toBeLessThanOrEqual(equalTo.b + 1)
    expect(color.b).toBeGreaterThanOrEqual(equalTo.b - 1)

    expect(color.a).toBeLessThanOrEqual(equalTo.a + 0.01)
    expect(color.a).toBeGreaterThanOrEqual(equalTo.a - 0.01)

  }

  test('check', () => {

    let testColors: {
      color: IRgba,
      tests: Array<{ mixin: IRgba, match: IRgba }>
    }[] = [
      {
        color: {r: 255, g: 0, b: 0, a: 1},
        tests: [
          {mixin: {r: 255, g: 255, b: 255, a: 0.1}, match: {r: 0xff, g: 0x1a, b: 0x1a, a: 1}},
          {mixin: {r: 255, g: 255, b: 255, a: 0.3}, match: {r: 0xff, g: 0x4d, b: 0x4d, a: 1}},
          {mixin: {r: 255, g: 255, b: 255, a: 0.4}, match: {r: 0xff, g: 0x66, b: 0x66, a: 1}},
          {mixin: {r: 255, g: 255, b: 255, a: 0.5}, match: {r: 0xff, g: 0x80, b: 0x80, a: 1}},
          {mixin: {r: 255, g: 255, b: 255, a: 0.6}, match: {r: 0xff, g: 0x99, b: 0x99, a: 1}},
          {mixin: {r: 255, g: 255, b: 255, a: 0.7}, match: {r: 0xff, g: 0xb3, b: 0xb3, a: 1}},
          {mixin: {r: 255, g: 255, b: 255, a: 0.8}, match: {r: 0xff, g: 0xcc, b: 0xcc, a: 1}},
          {mixin: {r: 255, g: 255, b: 255, a: 0.9}, match: {r: 0xff, g: 0xe6, b: 0xe6, a: 1}},
          {mixin: {r: 255, g: 255, b: 255, a: 1}, match: {r: 0xff, g: 0xff, b: 0xff, a: 1}},
        ]
      },
      {
        color: {r: 234, g: 34, b: 56, a: .5},
        tests: [
          // К сожалению, пока не знаю как провести корректный тест со смешением полупрозрачных цветов, так как
          // так как согласно документации цвет теряется
          // Due to the lossy nature of converting to and from
          // premultiplied alpha color values, pixels that have just been set
          // using putImageData() might be returned to an equivalent getImageData() as different values.
          // Подобная же потеря глубины цвета наблюдается и не на канвасе а на простом композитинге нескольких дивок
          // разных цветов и прозрачностей.
          // Более того, чем меньше альфа, тем больше потеря цвета
          {mixin: {r: 190, g: 167, b: 203, a: 1}, match: hexToRgb('#bea7cbff')!},
          {mixin: {r: 190, g: 167, b: 203, a: .9}, match: hexToRgb('#bfa1c3f3')!},
          {mixin: {r: 190, g: 167, b: 203, a: .8}, match: hexToRgb('#c298bae6')!},
          {mixin: {r: 190, g: 167, b: 203, a: .7}, match: hexToRgb('#c58fb0d9')!},
          {mixin: {r: 190, g: 167, b: 203, a: .6}, match: hexToRgb('#c986a6cc')!},
        ]
      }
    ]

    for (let {color, tests} of testColors) {
      for (let test of tests) {
        match(blend(color, test.mixin), test.match)
      }
    }

  })

  test('both transparent returns full transparent black', () => {
    match(blend({r: 255, g: 255, b: 255, a: 0}, {r: 0, g: 25, b: 13, a: 0}), {r: 0, b: 0, g: 0, a: 0})
  })

})
