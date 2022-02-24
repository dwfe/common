export interface IPath {
  pathname?: string;
  search?: string;
  hash?: string;
}

/**
 * For example:
 *   template: "/second/:page/world"
 *   pathname: "/second/hello/world"
 *   params: {page: 'hello'}
 */
export interface IPathnameParams {
  [key: string]: string;
}
