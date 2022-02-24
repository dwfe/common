export interface IPath {
  pathname?: string;
  search?: string;
  hash?: string;
}

export interface IPathnameParams { // `/second/:page/world` -> `/second/hello/world` = {page: 'hello'}
  [key: string]: string;
}
