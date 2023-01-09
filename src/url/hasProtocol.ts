export const hasProtocol = (str: string): boolean =>
  str.startsWith('http://') || str.startsWith('https://')
;
