export function capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ID(): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Convert UTF8 string to base64 string
 * @param text some text
 */
export function stringUTF8ToBase64(text: string) {
    return btoa(unescape(encodeURIComponent(text)));
}

/**
 * Convert base64 string to UTF8 string
 * @param text string in base64
 */
export function base64ToStringUTF8(text: string) {
    return decodeURIComponent(escape(window.atob(text)));
}

export const createSequence = (name: string): () => string => {
    let counter = 0;
    return () => name + (counter++);
};

export const addLineBreaks = (str: string) => str.replace(/\n|\r\n/g, '<br />')

export const getQueryStringFromObject = (obj: any) => {
    const str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

export class Guid {
    static newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }