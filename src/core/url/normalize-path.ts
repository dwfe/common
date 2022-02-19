import {normalizePathname} from './normalize-pathname'
import {normalizeSearch} from './normalize-search'
import {normalizeHash} from './normalize-hash'
import {IPath} from './contract'

export const normalizePath = (path: IPath): IPath => (
  {
    pathname: normalizePathname(path.pathname as any),
    search: normalizeSearch(path.search as any),
    hash: normalizeHash(path.hash as any)
  }
);
