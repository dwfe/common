
export class B64 {

  static fromUrl(str: string): string {
    str = str.replace(/\-/g, '+');
    str = str.replace(/\_/g, '/');
    while (str.length % 4) str += '=';
    return str;
  }

  static decodeUnicode(str: string): string {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''));
  }

  static encodeUnicode(str: string) {
    return btoa(encodeURIComponent(str).replace(
      /%([0-9A-F]{2})/g,
      (_: any, p1) => String.fromCharCode(parseInt(p1, 16))
    ));
  }

}

export function strToBase64(str: string): string {
  return btoa(encodeURIComponent(str));
}

export function base64ToStr(str: string): string {
  return decodeURIComponent(atob(str));
}
