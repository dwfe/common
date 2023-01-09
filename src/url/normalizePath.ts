import {normalizePathname} from './normalizePathname'
import {normalizeSearch} from './normalizeSearch'
import {normalizeHash} from './normalizeHash'
import {IPath} from './contract'

export const normalizePath = (path: IPath): Required<IPath> => (
  {
    pathname: normalizePathname(path.pathname),
    search: normalizeSearch(path.search),
    hash: normalizeHash(path.hash),
  }
);
