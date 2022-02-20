export const normalizePathname = (pathname?: string): string =>
  pathname
    ? pathname[0] === '/' ? pathname : `/${pathname}`
    : '/' // e.g. for url 'http://example.org:8888/?q=baz#bang' pathname => '/'
;
