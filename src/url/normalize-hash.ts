export const normalizeHash = (hash?: string): string =>
  hash
    ? hash[0] === '#' ? hash : `#${hash}`
    : ''
;
