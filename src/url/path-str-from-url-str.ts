import {pathToString} from './path-to-string';

export const pathStrFromUrlStr = (url: string): string =>
  pathToString(new URL(url)) // the entire url minus origin
;
