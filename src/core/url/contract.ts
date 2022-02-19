export interface IPath {
  pathname?: string;
  search?: string;
  hash?: string;
}

export interface IUrlParams {
  [key: string]: string;
}
