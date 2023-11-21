import {normalizePathname} from './normalizePathname';
import {normalizePath} from './normalizePath';
import {pathToString} from './pathToString';
import {hasProtocol} from './hasProtocol';
import {IPath} from './contract';

export function getURL(source: IPath | string): URL {
  if (typeof source !== 'string') {
    const path = normalizePath(source);
    source = pathToString(path);
  }
  const url = hasProtocol(source)
    ? source
    : window.location.origin + normalizePathname(source);
  return new URL(url);
}
