// tslint:disable:no-magic-numbers

export interface RequestOptions {
  mockData?: any; // tslint:disable-line:no-any
  post?: boolean;
  headers?: { [key: string]: string };
  data?: { [key: string]: string };
}

/**
 * Request a URL and return the content as plain text
 *
 * @param   url url to open
 * @returns     Promise resolved to a String
 */
export function request(url: string, options: RequestOptions = {}): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (options.mockData) {
      resolve(options.mockData);
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open(options.post ? 'POST' : 'GET', url, true);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 400) {
          resolve(xhr.responseText);
        } else {
          reject(xhr);
        }
      }
    };

    if (options.post) {
      xhr.setRequestHeader('Content-type', 'application/json');
    }

    if (options.headers) {
      Object.keys(options.headers).forEach((key) => {
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }

    try {
      xhr.send(options.post && options.data ? JSON.stringify(options.data) : undefined);
    } catch (error) {
      reject(error);
    }
  });
}
