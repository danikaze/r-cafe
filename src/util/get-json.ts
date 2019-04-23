import { isString } from 'vanilla-type-check/isString';
import { request } from './request';

/**
 * Opens a URL and load a JSON object
 *
 * @param   url URL to open
 * @returns     Promise resolved to the JSON object
 */
export function getJson<T extends {}>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    function resolveJson(data): void {
      let json: T;
      const str = isString(data) ? data : JSON.stringify(data);

      try {
        json = JSON.parse(str) as T;
        resolve(json);
      } catch (error) {
        reject(error);
      }
    }

    request(url, {
      headers: {
        Accept: 'application/json;odata=verbose',
      },
    }).then(resolveJson, reject);
  });
}
