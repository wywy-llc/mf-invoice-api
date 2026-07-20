import { MfOAuth2 } from '../../src/lib/mf-oauth2';

describe('MfOAuth2', () => {
  let mfServiceMock: Record<string, ReturnType<typeof vi.fn>>;
  let createServiceMock: ReturnType<typeof vi.fn>;
  let createHtmlOutputMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // モック: OAuth2Serviceのビルダーチェーン(各setterが自身を返す自己参照スタブ)
    mfServiceMock = {};
    [
      'setAuthorizationBaseUrl',
      'setTokenUrl',
      'setClientId',
      'setClientSecret',
      'setCallbackFunction',
      'setPropertyStore',
      'setCache',
      'setLock',
      'setScope',
    ].forEach(method => {
      mfServiceMock[method] = vi.fn().mockReturnValue(mfServiceMock);
    });
    mfServiceMock.getAuthorizationUrl = vi
      .fn()
      .mockReturnValue('https://mock-auth-url');
    mfServiceMock.handleCallback = vi.fn().mockReturnValue(true);
    mfServiceMock.reset = vi.fn();

    createServiceMock = vi.fn().mockReturnValue(mfServiceMock);
    createHtmlOutputMock = vi.fn(html => html);

    // モック: GASグローバル(プロパティ/キャッシュ/ロック/HTML出力)とOAuth2ライブラリ
    vi.stubGlobal('OAuth2', { createService: createServiceMock });
    vi.stubGlobal('PropertiesService', {
      getUserProperties: vi.fn().mockReturnValue({}),
    });
    vi.stubGlobal('CacheService', {
      getUserCache: vi.fn().mockReturnValue({}),
    });
    vi.stubGlobal('LockService', { getUserLock: vi.fn().mockReturnValue({}) });
    vi.stubGlobal('HtmlService', { createHtmlOutput: createHtmlOutputMock });
  });

  describe('constructor', () => {
    it('clientIdが空だと、"スクリプトプロパティにCLIENT_IDとCLIENT_SECRETを設定してください。"エラーを投げる', () => {
      expect(() => new MfOAuth2('', 'secret')).toThrow(
        'スクリプトプロパティにCLIENT_IDとCLIENT_SECRETを設定してください。'
      );
    });
    it('clientSecretが空だと、"スクリプトプロパティにCLIENT_IDとCLIENT_SECRETを設定してください。"エラーを投げる', () => {
      expect(() => new MfOAuth2('id', '')).toThrow(
        'スクリプトプロパティにCLIENT_IDとCLIENT_SECRETを設定してください。'
      );
    });
    it('clientIdとclientSecretを指定すると、エラーを投げずにインスタンスを生成する', () => {
      expect(() => new MfOAuth2('id', 'secret')).not.toThrow();
    });
  });

  describe('create', () => {
    it('静的メソッドcreateを呼び出すと、MfOAuth2インスタンスを返す', () => {
      const oauth2 = MfOAuth2.create('id', 'secret');
      expect(oauth2).toBeInstanceOf(MfOAuth2);
    });
  });

  describe('getMfService', () => {
    it('呼び出すと、mf-invoice-client-v3サービスをクライアント情報付きで生成する', () => {
      const oauth2 = new MfOAuth2('id', 'secret');
      oauth2.getMfService();
      expect(createServiceMock).toHaveBeenCalledWith('mf-invoice-client-v3');
      expect(mfServiceMock.setClientId).toHaveBeenCalledWith('id');
      expect(mfServiceMock.setClientSecret).toHaveBeenCalledWith('secret');
      expect(mfServiceMock.setCallbackFunction).toHaveBeenCalledWith(
        'mfCallback'
      );
      expect(mfServiceMock.setScope).toHaveBeenCalledWith(
        'mfc/invoice/data.write mfc/invoice/data.read'
      );
    });
    it('2回呼び出すと、2回目はキャッシュされたサービスを再利用しビルダーチェーンを再構築しない', () => {
      const oauth2 = new MfOAuth2('id', 'secret');
      const first = oauth2.getMfService();
      const second = oauth2.getMfService();
      expect(second).toBe(first);
      expect(createServiceMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleCallback', () => {
    it('認証成功時、"認証成功しました。このタブを閉じてください。"を出力する', () => {
      mfServiceMock.handleCallback.mockReturnValue(true);
      const oauth2 = new MfOAuth2('id', 'secret');
      oauth2.handleCallback({});
      expect(createHtmlOutputMock).toHaveBeenCalledWith(
        '認証成功しました。このタブを閉じてください。'
      );
    });
    it('認証失敗時、"認証に失敗しました。"を出力する', () => {
      mfServiceMock.handleCallback.mockReturnValue(false);
      const oauth2 = new MfOAuth2('id', 'secret');
      oauth2.handleCallback({});
      expect(createHtmlOutputMock).toHaveBeenCalledWith('認証に失敗しました。');
    });
  });

  describe('logout', () => {
    it('呼び出すと、OAuth2サービスをリセットする', () => {
      const oauth2 = new MfOAuth2('id', 'secret');
      oauth2.logout();
      expect(mfServiceMock.reset).toHaveBeenCalled();
    });
  });

  describe('getAuthorizationUrl', () => {
    it('呼び出すと、OAuth2サービスの認証URLを返す', () => {
      const oauth2 = new MfOAuth2('id', 'secret');
      const result = oauth2.getAuthorizationUrl();
      expect(result).toBe('https://mock-auth-url');
    });
  });
});
