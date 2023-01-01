import {normalizePathname} from './normalize-pathname';
import {hasProtocol} from './has-protocol';

export const complementPath = (path: string, origin?: string): string => {
  if (!origin || hasProtocol(path))
    return path;
  return origin + normalizePathname(path);
}
