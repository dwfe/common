import {IPath} from './contract';

export const pathToString = (p: IPath): string =>
  `${p.pathname ?? ''}${p.search ?? ''}${p.hash ?? ''}`
;
