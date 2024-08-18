import {IAnyObject} from '../contract';

export const handleTemplate = (text: string, params: IAnyObject) => {
  return text.replace(                       // 1. Берет строку
    /{{([\w\d\.]+)}}/g,                      // 2. Циклом ищет в строке шаблон вида: {{НАЗВАНИЕ_ПАРАМЕТРА}}. В одной строке может быть несколько шаблонов.
    (_: any, match: string) => params[match] // 3. Заменяет НАЗВАНИЕ_ПАРАМЕТРА на соответствующее значение из params
  );
}
