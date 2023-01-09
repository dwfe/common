import {normalizePathname} from './normalizePathname';
import {hasProtocol} from './hasProtocol';

export const complementPath = (path: string, origin?: string): string => {
  if (!origin || hasProtocol(path))
    return path;
  return origin + normalizePathname(path);
}
