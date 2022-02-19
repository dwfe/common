export const normalizeSearch = (search: string): string =>
  search
    ? search[0] === '?' ? search : `?${search}`
    : ''
;
