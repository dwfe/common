import {IPath} from './contract';

export const isPathEqual = (p1: IPath, p2: IPath): boolean =>
  p1.pathname === p2.pathname &&
  p1.search === p2.search &&
  p1.hash === p2.hash
;
