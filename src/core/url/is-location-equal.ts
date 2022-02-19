import {IPath} from './contract';

export const isLocationEqual = (p1: IPath, p2: IPath): boolean =>
  p1.pathname === p2.pathname &&
  p1.search === p2.search
;
