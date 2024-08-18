import {normalizePath} from './normalizePath';
import {getURL} from './getURL';
import {IPath} from './contract';

/**
 * Interface IPath can implement a wide variety of objects.
 * But using the passed object directly can lead to unexpected problems.
 * Therefore, the object is truncated exactly to the composition of the IPath fields.
 */
export function normalizePathUniversal(to: IPath | string): Required<IPath> {
  const path = typeof to === 'string' ? getURL(to) : to;
  return normalizePath(path);
}
