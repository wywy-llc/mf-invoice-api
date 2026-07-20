/**
 * Copyright 2026 wywy LLC and contributors
 */
import { vi } from 'vitest';

/**
 * service-base.ts の fetch/processResponse が参照する
 * getResponseCode/getContentText を持つ疑似 HTTPResponse を生成する
 *
 * UrlFetchApp をモックせず、processResponse を直接検証したい場合に使う。
 *
 * @example
 * const res = makeHttpResponse(200, JSON.stringify(billing));
 * expect(service.processResponse(res)).toEqual(billing);
 */
export function makeHttpResponse(
  responseCode: number,
  body: string = ''
): GoogleAppsScript.URL_Fetch.HTTPResponse {
  // processResponse が参照する2メソッドのみ実装した部分モック(テストダブル)
  return {
    getResponseCode: () => responseCode,
    getContentText: () => body,
  } as GoogleAppsScript.URL_Fetch.HTTPResponse;
}

/**
 * UrlFetchApp.fetch をモックし、呼び出し引数(URL・options)を検証可能な vi.fn() を返す
 *
 * service-base.ts の fetch/processResponse が参照する
 * getResponseCode/getContentText を持つ疑似 HTTPResponse を返す。
 *
 * @example
 * const fetchMock = stubUrlFetch(200, JSON.stringify(billing));
 * // ...
 * expect(fetchMock).toHaveBeenCalledWith(
 *   expectedUrl,
 *   expect.objectContaining({ method: 'get' })
 * );
 */
export function stubUrlFetch(responseCode: number, body: string = '') {
  const fetchMock = vi
    .fn()
    .mockReturnValue(makeHttpResponse(responseCode, body));
  vi.stubGlobal('UrlFetchApp', { fetch: fetchMock });
  return fetchMock;
}

/**
 * 200 + JSON ボディを返す UrlFetchApp.fetch モックを設定する(正常系・戻り値検証用)
 *
 * @example
 * const fetchMock = stubUrlFetchJson(billing);
 */
export function stubUrlFetchJson(data: unknown) {
  return stubUrlFetch(200, JSON.stringify(data));
}

/**
 * 204 + 空ボディを返す UrlFetchApp.fetch モックを設定する
 *
 * processResponse は 204 かつ空ボディの場合 true を返す(service-base.ts:145-148)。
 *
 * @example
 * const fetchMock = stubUrlFetchEmpty();
 */
export function stubUrlFetchEmpty() {
  return stubUrlFetch(204, '');
}

/**
 * エラーレスポンス(4xx/5xx)を返す UrlFetchApp.fetch モックを設定する
 *
 * processResponse は 400 以上のとき `Request Failed !!. {code}: {body}` を throw する
 * (service-base.ts:149-154)。
 *
 * @example
 * const fetchMock = stubUrlFetchError(404, 'Not Found');
 */
export function stubUrlFetchError(responseCode: number, body: string = '') {
  return stubUrlFetch(responseCode, body);
}
