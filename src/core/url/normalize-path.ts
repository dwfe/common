import {normalizePathname} from './normalize-pathname'
import {normalizeSearch} from './normalize-search'
import {normalizeHash} from './normalize-hash'
import {IPath} from './contract'

export const normalizePath = (path: IPath): IPath => (
  {
    pathname: normalizePathname(path.pathname),
    search: normalizeSearch(path.search),
    hash: normalizeHash(path.hash),
  }
);
