import {IRgba} from './contract';

/**
 * Смешение одного компонента цвета
 */
function blendShade(destination: IRgba, source: IRgba, shade: keyof IRgba) {
  const sourceAlpha = source.a
  const destinationAlpha = destination.a

  // итоговая альфа расчитывается как совокупность двух альф. Непрорзрачность не может уменьшиться, только увеличиться
  let alphaRes =  Math.min(1, sourceAlpha + destinationAlpha * (1 - sourceAlpha))

  switch (shade) {
    case 'a':
      return alphaRes
  }

  // Домножение на альфа канал цвета здесь - так называемое "предумножение" для корректного смешения
  // https://html.spec.whatwg.org/dev/canvas.html#premultiplied-alpha-and-the-2d-rendering-context
  return Math.round((source[shade] * sourceAlpha + destination[shade] * destinationAlpha * (1 - sourceAlpha)) / alphaRes)
}

/**
 * Смешать цвета
 * Алгоритм https://www.w3.org/TR/compositing-1/#simplealphacompositing
 *
 * Порядок важен. Правильно будет думать о слоях, где каждый последующий слой накладывается на результат слияния предыдущих.
 * Прозрачность важна - если один из всех цветов будет непрозрачным, итоговый результат будет непрозрачным, а все цвета,
 * наложенные перед непрозрачным, будут затёрты
 *
 * При комопозиции цветов, если требуется непрозрачный результирующий цвет, учитывайте, на каком фоне он находится.
 * Без этого учёта, результат будет аналогичен нахождению на белом фоне
 *
 * !!ВНИМАНИЕ!!
 * Результат не полностью совпдадает с результатом композиции браузером, по пока что неизвестным причинам.
 * В большинстве случаев, отличие находится в пределах +-1/256 для каждого компонента цвета. На взгляд это трудно, но
 * уловимо.При мальеньких результирующих значениях альфы расхождение может увеличиваться, и тем более при маленьких альфах
 * и нескольких композициях.
 *
 * Одна из возможных причин - округление цвета браузером на каждом этапе предумножения на альфа-канал. Например,
 * если заполнить canvas частично прозрачным цветом, а затем достать пиксельные данные с холста, то можно увидеть, что
 * фактические пиксельные данные отличаются. Очевидно, что при смешении "округлённых" цветов результат будет отличаться.
 * Потеря данных происходит на этапе восстановления значения пикселя из "предумноженного".
 * Хорошая статья в целом на тему https://habr.com/ru/articles/468067/
 *
 * https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-getimagedata-dev
 * "Due to the lossy nature of converting between color spaces and converting to and from premultiplied
 * alpha color values, pixels that have just been set using putImageData(),
 * and are not completely opaque, might be returned to an equivalent getImageData() as different values."
 *
 * Соответственно, в теориии, нужно будет реализовать потерю глубины цвета, как её теряет браузер)
 *
 * @param destination Первый слой, на который накладываются все последующие
 * @param sources
 */
export function blend(destination: IRgba, ...sources: IRgba[]) {
  for (let source of sources) {
    if (!destination.a && !source.a) {
      destination = {r: 0, b: 0, g: 0, a: 0}
      continue
    }
    let newColor = {...source}
    for (let key of ['r', 'g', 'b', 'a'] as const) {
      newColor[key] = blendShade(destination, source, key)
    }
    destination = newColor
  }

  return destination
}
