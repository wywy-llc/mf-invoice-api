import { ServiceBase, ReqMethod } from '../../src/service/service-base';
import {
  stubUrlFetch,
  stubUrlFetchJson,
  makeHttpResponse,
} from '../helpers/gas-mock';

describe('ServiceBase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('getAccessToken関数を指定すると、インスタンスが生成される', () => {
      expect(() => new ServiceBase(() => 'token_1')).not.toThrow();
    });

    it('getAccessTokenが関数でないと、"accessToken is required."エラー', () => {
      expect(
        () => new ServiceBase(undefined as unknown as () => string)
      ).toThrow('accessToken is required.');
    });
  });

  describe('getHeaders', () => {
    it('accessTokenを含むBearer認証ヘッダーを返す', () => {
      const service = new ServiceBase(() => 'token_1');
      expect(service.getHeaders()).toEqual({
        accept: 'application/json',
        Authorization: 'Bearer token_1',
      });
    });

    it('呼び出すたびにgetAccessTokenを呼び出し、最新の戻り値をBearerに反映する', () => {
      // モック: 呼び出しごとに異なるトークンを返すgetAccessToken(リフレッシュ後の挙動を模す)
      const tokens = ['token_1', 'token_2'];
      const getAccessToken = vi.fn(() => tokens.shift() as string);
      const service = new ServiceBase(getAccessToken);

      // 検証: 2回のgetHeaders()呼び出しがそれぞれ都度取得した値を反映する
      expect(service.getHeaders().Authorization).toBe('Bearer token_1');
      expect(service.getHeaders().Authorization).toBe('Bearer token_2');
      expect(getAccessToken).toHaveBeenCalledTimes(2);
    });
  });

  describe('fetch', () => {
    it('GETメソッドで呼び出すと、payloadとcontentTypeを付与せずUrlFetchAppを呼ぶ', () => {
      const fetchMock = stubUrlFetchJson({});
      const service = new ServiceBase(() => 'token_1');

      service.fetch('https://example.com', ReqMethod.get);

      expect(fetchMock).toHaveBeenCalledWith('https://example.com', {
        method: 'get',
        muteHttpExceptions: true,
        headers: service.getHeaders(),
      });
    });

    it('POSTメソッドかつpayloadを指定すると、payloadとcontentTypeを付与する', () => {
      const fetchMock = stubUrlFetchJson({});
      const service = new ServiceBase(() => 'token_1');

      service.fetch('https://example.com', ReqMethod.post, '{"a":1}');

      expect(fetchMock).toHaveBeenCalledWith('https://example.com', {
        method: 'post',
        muteHttpExceptions: true,
        headers: service.getHeaders(),
        payload: '{"a":1}',
        contentType: 'application/json',
      });
    });

    it('POSTメソッドでもpayloadが空文字だと、payloadとcontentTypeを付与しない', () => {
      const fetchMock = stubUrlFetchJson({});
      const service = new ServiceBase(() => 'token_1');

      service.fetch('https://example.com', ReqMethod.post);

      expect(fetchMock).toHaveBeenCalledWith('https://example.com', {
        method: 'post',
        muteHttpExceptions: true,
        headers: service.getHeaders(),
      });
    });

    it('PUTメソッドかつpayloadを指定すると、payloadとcontentTypeを付与する', () => {
      const fetchMock = stubUrlFetchJson({});
      const service = new ServiceBase(() => 'token_1');

      service.fetch('https://example.com', ReqMethod.put, '{"a":1}');

      expect(fetchMock).toHaveBeenCalledWith('https://example.com', {
        method: 'put',
        muteHttpExceptions: true,
        headers: service.getHeaders(),
        payload: '{"a":1}',
        contentType: 'application/json',
      });
    });

    it('DELETEメソッドでpayloadを指定しても、payloadとcontentTypeを付与しない', () => {
      const fetchMock = stubUrlFetchJson({});
      const service = new ServiceBase(() => 'token_1');

      service.fetch('https://example.com', ReqMethod.delete, '{"a":1}');

      expect(fetchMock).toHaveBeenCalledWith('https://example.com', {
        method: 'delete',
        muteHttpExceptions: true,
        headers: service.getHeaders(),
      });
    });

    it('UrlFetchAppが返したレスポンスをそのまま返す', () => {
      stubUrlFetch(200, 'body');
      const service = new ServiceBase(() => 'token_1');

      const res = service.fetch('https://example.com', ReqMethod.get);

      expect(res.getResponseCode()).toBe(200);
      expect(res.getContentText()).toBe('body');
    });
  });

  describe('processResponse', () => {
    it('レスポンスコード200かつJSONボディの場合、パース済みオブジェクトを返す', () => {
      const service = new ServiceBase(() => 'token_1');
      const res = makeHttpResponse(200, JSON.stringify({ id: 'billing_1' }));

      expect(service.processResponse(res)).toEqual({ id: 'billing_1' });
    });

    it('レスポンスコード201かつJSONボディの場合、パース済みオブジェクトを返す', () => {
      const service = new ServiceBase(() => 'token_1');
      const res = makeHttpResponse(201, JSON.stringify({ id: 'billing_1' }));

      expect(service.processResponse(res)).toEqual({ id: 'billing_1' });
    });

    it('レスポンスコード204かつ空ボディの場合、trueを返す', () => {
      const service = new ServiceBase(() => 'token_1');
      const res = makeHttpResponse(204, '');

      expect(service.processResponse(res)).toBe(true);
    });

    it('レスポンスコード200でもボディが空文字の場合、trueを返す', () => {
      const service = new ServiceBase(() => 'token_1');
      const res = makeHttpResponse(200, '');

      expect(service.processResponse(res)).toBe(true);
    });

    it('レスポンスコードが400以上の場合、コードとボディを含むエラーをthrowする', () => {
      const service = new ServiceBase(() => 'token_1');
      const res = makeHttpResponse(404, 'Not Found');

      expect(() => service.processResponse(res)).toThrow(
        'Request Failed !!. 404: Not Found'
      );
    });

    it('レスポンスコードが500の場合、コードとボディを含むエラーをthrowする', () => {
      const service = new ServiceBase(() => 'token_1');
      const res = makeHttpResponse(500, 'Internal Server Error');

      expect(() => service.processResponse(res)).toThrow(
        'Request Failed !!. 500: Internal Server Error'
      );
    });

    it('レスポンスコード200でもボディが不正なJSONの場合、コードとボディを含む明示的なエラーをthrowする', () => {
      const service = new ServiceBase(() => 'token_1');
      const res = makeHttpResponse(200, '<html>Not JSON</html>');

      expect(() => service.processResponse(res)).toThrow(
        'Response body is not valid JSON !!. 200: <html>Not JSON</html>'
      );
    });
  });
});
