/**
 * MfInvoiceApi — GAS ライブラリ公開API 統合型定義(配布用)
 *
 * このファイルは `src/@types/*.d.ts` を1ファイルへ集約した配布物です。
 * ビルド成果物(dist/)ではなく手動生成物です。
 * `src/@types/` を修正した際は本ファイルも追従してください。
 *
 * 想定利用者: clasp でローカル開発する利用者(AGENTS.md のケースB)。
 * 自分のプロジェクトへコピーし、型補完・型チェックに使います。
 * ブラウザのGASエディタ(ケースA)はこのファイルを読み込みません。
 *
 * 配置と push:
 * - clasp の push 対象は既定で .js / .gs / .html と appsscript.json です。
 * - この .d.ts は push されませんが、srcDir の外に置くと確実です。
 *
 * ライブラリの追加方法(ケースB):
 * - 利用者側の appsscript.json の dependencies.libraries に記述します。
 * - userSymbol: MfInvoiceApi
 * - libraryId: 1kAOHBDg2JgIT2rRNKIK_x1iERg0Q4IF1uulKs7Q_g8jAn_Y75906TtQ4
 * - version: GASライブラリのバージョン番号(clasp list-versions で確認)
 * - developmentMode: false
 *
 * 使い方の詳細: examples/agent-context/AGENTS.md を参照。
 */
declare namespace MfInvoiceApi {
  //== トップレベル関数(利用者側のコードから `MfInvoiceApi.xxx` で呼び出す) ==//

  /**
   * MF請求書APIクライアントを生成します。
   * @param {string} clientId クライアントID
   * @param {string} clientSecret クライアントシークレット
   * @returns {MfInvoiceApi.MfClient} MF請求書APIクライアント
   */
  declare function createClient(
    clientId: string,
    clientSecret: string
  ): MfInvoiceApi.MfClient;
  /**
   * 入金ステータスを取得します。
   * - default: '0', // 未設定
   * - not_payment: '1', // 未入金
   * - completed: '2', // 入金済
   * - unpaid: '3', // 未払い
   * - transferred: '4', // 振込済
   * @param {string} status 入金ステータス
   * @returns {string} 入金ステータス(数値)
   */
  declare function getPaymentStatus(status: string): string;
  /**
   * 受注ステータスを取得します。
   * - failure: '-1', // 失注
   * - default: '0', // 未設定
   * - not_received: '1', // 未受注
   * - received: '2', // 受注済
   * @param {string} status 受注ステータス
   * @returns {string} 受注ステータス(数値)
   */
  declare function getOrderStatus(status: string): string;
  /**
   * 日付操作用のユーティリティクラスを生成します。
   * @param {Date} baseDate
   * @returns {DateUtil} 日付操作用のユーティリティクラス
   */
  declare function getDateUtil(baseDate: Date): DateUtil;
  /**
   * mfからログアウトします。
   * @param {string} clientId クライアントID
   * @param {string} clientSecret クライアントシークレット
   */
  declare function logout(clientId: string, clientSecret: string): void;
  /**
   * MF認証のコールバック関数です。
   * @param {any} request リクエスト
   * @param {string} clientId クライアントID
   * @param {string} clientSecret クライアントシークレット
   */
  declare function mfCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: any,
    clientId: string,
    clientSecret: string
  ): GoogleAppsScript.HTML.HtmlOutput;
  /**
   * MF請求書API認証ダイアログを表示します。
   * @param {string} clientId クライアントID
   * @param {string} clientSecret クライアントシークレット
   */
  declare function showMfApiAuthDialog(
    clientId: string,
    clientSecret: string
  ): void;
  /**
   * 認証URLを取得します。
   * @param {string} clientId クライアントID
   * @param {string} clientSecret クライアントシークレット
   */
  declare function createMfAuthUrl(
    clientId: string,
    clientSecret: string
  ): string;
  /**
   * リダイレクトURIを取得します。
   * @returns {string} リダイレクトURI
   */
  declare function getRedirectUri(): string;

  //== クライアント(createClient の戻り値。6サービスを束ねる) ==//

  /**
   * マネーフォワード請求API用クライアント
   * ■ Money Forward Invoice API
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/
   */
  interface MfClient {
    /**
     * 請求API
     * @type {MfInvoiceApi.BillingService}
     */
    billings: BillingService;
    /**
     * 見積API
     * @type {MfInvoiceApi.QuoteService}
     */
    quotes: QuoteService;
    /**
     * 取引先API
     * @type {MfInvoiceApi.PartnerService}
     */
    partners: PartnerService;
    /**
     * 品目API
     * @type {MfInvoiceApi.ItemService}
     */
    items: ItemService;
    /**
     * 事業所API
     * @type {MfInvoiceApi.OfficeService}
     */
    office: OfficeService;
    /**
     * 送付履歴API
     * @type {MfInvoiceApi.SentHistoryService}
     */
    sentHistories: SentHistoryService;
  }

  //== 日付ユーティリティ(getDateUtil の戻り値) ==//

  /**
   * 日付ユーティリティクラス
   */
  interface DateUtil {
    /**
     * 日付文字列を取得します。
     * @param {number} type 出力パターン
     * 1: YYYY-MM-DD
     * 2: YYYYMM
     * 3: YYYY年MM月
     * @return {string} 日付文字列
     */
    getDateString(type?: number): string;
    /**
     * 時刻文字列を取得します。
     * @return {string} 本日日付(YYYY-MM-DD hh:mm:dd)
     */
    getTimeString(): string;
    /**
     * 月末日付の文字列を取得します。
     * @return {string} 今月末日付((YYYY-MM-DD)
     */
    getEndDateBaseMonth(): string;
    /**
     * 先月末の文字列を取得します。
     * @return {string} 先月末日付((YYYY-MM-DD)
     */
    getEndDateLastMonth(): string;
    /**
     * 来月末日付の文字列を取得します。
     * @return {string} 来月末日付(YYYY-MM-DD)
     */
    getEndDateNextMonth(): string;
  }

  //== 列挙 / サービス共通基底 ==//

  /**
   * 入金ステータス
   */
  export declare const PaymentStatus: {
    readonly default: '0'; // 未設定
    readonly not_payment: '1'; // 未入金
    readonly completed: '2'; // 入金済
    readonly unpaid: '3'; // 未払い
    readonly transferred: '4'; // 振込済
  };
  export type PaymentStatus =
    (typeof PaymentStatus)[keyof typeof PaymentStatus];

  /**
   * 受注ステータス
   */
  export declare const OrderStatus: {
    readonly failure: '-1'; // 失注
    readonly default: '0'; // 未設定
    readonly not_received: '1'; // 未受注
    readonly received: '2'; // 受注済
  };
  export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

  /**
   * 請求の期間絞込対象
   */
  export declare const BillingRangeKey: {
    readonly billing_date: 'billing_date'; // 請求日
    readonly due_date: 'due_date'; // 支払期日
    readonly sales_date: 'sales_date'; // 売上計上日
    readonly created_at: 'created_at'; // 作成日
    readonly updated_at: 'updated_at'; // 更新日
  };
  export type BillingRangeKey =
    (typeof BillingRangeKey)[keyof typeof BillingRangeKey];

  /**
   * 見積の期間絞込対象
   */
  export declare const QuoteRangeKey: {
    readonly quote_date: 'quote_date';
    readonly expired_date: 'expired_date';
    readonly created_at: 'created_at';
    readonly updated_at: 'updated_at';
  };
  export type QuoteRangeKey =
    (typeof QuoteRangeKey)[keyof typeof QuoteRangeKey];

  /**
   * 税率
   */
  export declare const Excise: {
    readonly untaxable: 'untaxable';
    readonly non_taxable: 'non_taxable';
    readonly tax_exemption: 'tax_exemption';
    readonly five_percent: 'five_percent';
    readonly eight_percent: 'eight_percent';
    readonly eight_percent_as_reduced_tax_rate: 'eight_percent_as_reduced_tax_rate';
    readonly ten_percent: 'ten_percent';
  };
  export type Excise = (typeof Excise)[keyof typeof Excise];

  /**
   * サービスの基底クラス(各サービスが継承する内部インターフェース)
   */
  interface ServiceBase {
    fetch(
      reqUrl: string,
      method: GoogleAppsScript.URL_Fetch.HttpMethod,
      payload?: string
    ): GoogleAppsScript.URL_Fetch.HTTPResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processResponse(res: GoogleAppsScript.URL_Fetch.HTTPResponse): any;
    getHeaders(): GoogleAppsScript.URL_Fetch.HttpHeaders;
  }

  //== billings(請求書API) ==//

  interface BillingService extends ServiceBase {
    baseUrl: string;
    /**
     * 請求書一覧の取得
     * @param {string} from 検索範囲_開始日
     * @param {string} to 検索範囲_終了日
     * @param {string} query 検索文字列
     * @param {number} page ページ番号
     * @param {number} perPage 1ページあたりの件数
     * @param {BillingRangeKey} rangeKey 検索範囲キー
     * - billing_date: 請求日 / due_date: 支払期日 / sales_date: 売上日 / created_at: 作成日 / updated_at: 更新日
     * @returns {MfInvoiceApi.BillingsResponse} 請求書レスポンス
     */
    getBillings(
      from: string,
      to: string,
      query?: string,
      page?: number,
      perPage?: number,
      rangeKey?: BillingRangeKey
    ): MfInvoiceApi.BillingsResponse;
    /**
     * インボイス制度に対応した形式の請求書の作成
     * @param {MfInvoiceApi.BillingReqBody} billingReqBody 請求書リクエストボディ
     * @returns {MfInvoiceApi.Billing} 請求書
     */
    createNew(
      billingReqBody: MfInvoiceApi.BillingReqBody
    ): MfInvoiceApi.Billing;
    /**
     * 請求書の取得
     * @param {string} billingId 請求書ID
     * @returns {MfInvoiceApi.Billing} 請求書
     */
    getBilling(billingId: string): MfInvoiceApi.Billing;
    /**
     * 請求書の更新
     * @param {string} billingId 請求書ID
     * @param {MfInvoiceApi.BillingReqBody} billingReqBody 請求書リクエストボディ
     * @returns {MfInvoiceApi.Billing} 請求書
     */
    updateBilling(
      billingId: string,
      billingReqBody: MfInvoiceApi.BillingReqBody
    ): MfInvoiceApi.Billing;
    /**
     * 請求書の入金ステータス変更
     * このエンドポイントは仕様上、未設定・未入金・入金済みの3値のみ受け付ける
     * (未払い・振込済みはAPI側で自動計算されるため直接指定不可)
     * @param {string} billingId 請求書ID
     * @param {Extract<MfInvoiceApi.PaymentStatus, '0' | '1' | '2'>} paymentStatus 入金ステータス
     */
    updatePaymentStatus(
      billingId: string,
      paymentStatus: Extract<MfInvoiceApi.PaymentStatus, '0' | '1' | '2'>
    ): MfInvoiceApi.Billing;
    /**
     * 請求書の削除
     * @param {string} billingId 請求書ID
     * @returns {boolean} 削除成功時はtrue
     */
    deleteBilling(billingId: string): boolean;
    /**
     * 請求書に紐づく品目一覧の取得
     * @param {string} billingId 請求書ID
     * @returns {MfInvoiceApi.BillingsResponse} 請求書レスポンス
     */
    getBillingItems(billingId: string): MfInvoiceApi.BillingsResponse;
    /**
     * 請求書に紐づく品目の取得
     * @param {string} billingId 請求書ID
     * @param {string} itemId 品目ID
     * @returns {MfInvoiceApi.BillingItem} 請求書品目
     */
    getBillingItem(billingId: string, itemId: string): MfInvoiceApi.BillingItem;
    /**
     * 請求書に品目を追加
     * @param billingId 請求書ID
     * @param itemReqBody 品目リクエストボディ(item_idまたはnameのいずれかが必須)
     * @returns {boolean} 成功時はtrue
     */
    attachBillingItem(
      billingId: string,
      itemReqBody: MfInvoiceApi.BillingItemReqBody
    ): boolean;
    /**
     * 請求書に紐づく品目の削除
     * @param {string} billingId 請求書ID
     * @param {string} itemId 品目ID
     * @returns {boolean} 削除成功時はtrue
     */
    deleteBillingItem(billingId: string, itemId: string): boolean;
    /**
     * 請求書の郵送依頼
     * @param {string} billingId 請求書ID
     * @returns {boolean} 郵送依頼成功時はtrue
     */
    applyToPostBilling(billingId: string): boolean;
    /**
     * 請求書の郵送キャンセル
     * @param {string} billingId 請求書ID
     * @returns {boolean} 郵送キャンセル成功時はtrue
     */
    cancelPostBilling(billingId: string): boolean;
  }

  //== quotes(見積書API) ==//

  interface QuoteService extends ServiceBase {
    baseUrl: string;
    /**
     * 見積書一覧の取得
     * @param {string} from 検索範囲_開始日
     * @param {string} to 検索範囲_終了日
     * @param {string} query 検索文字列
     * @param {number} page ページ番号
     * @param {number} perPage 1ページあたりのデータ数
     * @param {QuoteRangeKey} rangeKey 検索範囲_キー
     * - quote_date: 見積日 / expired_date: 有効期限 / created_at: 作成日 / updated_at: 更新日
     * @param {MfInvoiceApi.QuoteListFilters} filters 取引先ID・見積書番号・ステータス・取引先名・タグでの絞込(queryを指定した場合はこれらは検索に使用されない)
     * @returns {MfInvoiceApi.QuotesResponse} 見積書レスポンス
     */
    getQuotes(
      from: string,
      to: string,
      query?: string,
      page?: number,
      perPage?: number,
      rangeKey?: QuoteRangeKey,
      filters?: MfInvoiceApi.QuoteListFilters
    ): MfInvoiceApi.QuotesResponse;
    /**
     * 見積書の作成
     * @param {MfInvoiceApi.QuoteReqBody} quoteReqBody 見積書リクエストボディ
     * @returns {MfInvoiceApi.Quote} 見積書
     */
    createNew(quoteReqBody: MfInvoiceApi.QuoteReqBody): MfInvoiceApi.Quote;
    /**
     * 見積書の取得
     * @param {string} quoteId 見積書ID
     * @returns {MfInvoiceApi.Quote} 見積書
     */
    getQuote(quoteId: string): MfInvoiceApi.Quote;
    /**
     * 見積書の更新
     * @param {string} quoteId 見積書ID
     * @param {MfInvoiceApi.QuoteReqBody} quoteReqBody 見積書リクエストボディ
     * @returns {MfInvoiceApi.Quote} 見積書
     */
    updateQuote(
      quoteId: string,
      quoteReqBody: MfInvoiceApi.QuoteReqBody
    ): MfInvoiceApi.Quote;
    /**
     * 見積書の削除
     * @param {string} quoteId 見積書ID
     * @returns {boolean} 削除成功時はtrue
     */
    deleteQuote(quoteId: string): boolean;
    /**
     * 見積書に紐づく品目一覧の取得
     * @param {string} quoteId 見積書ID
     * @returns {MfInvoiceApi.QuoteItemResponse} 見積書品目レスポンス
     */
    getQuoteItems(quoteId: string): MfInvoiceApi.QuoteItemResponse;
    /**
     * 見積書に紐づく品目を取得
     * @param {string} quoteId 見積書ID
     * @param {string} itemId 品目ID
     * @returns {MfInvoiceApi.Item} 品目
     */
    getQuoteItem(quoteId: string, itemId: string): MfInvoiceApi.Item;
    /**
     * 見積書に品目を追加
     * @param {string} quoteId 見積書ID
     * @param {MfInvoiceApi.QuoteItemReqBody} quoteItemReqBody 見積書品目リクエストボディ(item_idまたはnameのいずれかが必須)
     * @returns {boolean} 成功時はtrue
     */
    attachQuoteItem(
      quoteId: string,
      quoteItemReqBody: MfInvoiceApi.QuoteItemReqBody
    ): boolean;
    /**
     * 見積書に紐づく品目を削除
     * @param {string} quoteId 見積書ID
     * @param {string} itemId 品目ID
     * @returns {boolean} 削除成功時はtrue
     */
    deleteQuoteItem(quoteId: string, itemId: string): boolean;
    /**
     * 見積書の郵送依頼
     * @param {string} quoteId 見積書ID
     * @returns {boolean} 郵送依頼成功時はtrue
     */
    applyToPostQuote(quoteId: string): boolean;
    /**
     * 見積書の郵送キャンセル
     * @param {string} quoteId 見積書ID
     * @returns {boolean} 郵送キャンセル成功時はtrue
     */
    cancelPostQuote(quoteId: string): boolean;
    /**
     * 見積書の受注ステータス更新
     * 注意: spec上、このPUTリクエストのenumは数値文字列('-1'〜'2')だが、
     * Quoteレスポンスの order_status は別表記(語形: failure/default/not_received/received)になっている
     * (仕様側の request/response enum不一致。本メソッドの送信値はrequest契約に準拠)
     * @param {string} quoteId 見積書ID
     * @param {MfInvoiceApi.OrderStatus} status 受注ステータス
     */
    updateOrderStatus(
      quoteId: string,
      orderStatus: MfInvoiceApi.OrderStatus
    ): boolean;
    /**
     * 見積書を請求書に変換
     * @param {string} quoteId 見積書ID
     * @returns {MfInvoiceApi.Billing} 請求書
     */
    convertQuoteToBilling(quoteId: string): MfInvoiceApi.Billing;
  }

  //== partners(取引先API) ==//

  interface PartnerService extends ServiceBase {
    baseUrl: string;
    /**
     * 取引先一覧の取得
     * @param {number} page ページ番号
     * @param {number} perPage 1ページあたりのデータ数
     * @returns {MfInvoiceApi.PartnersResponse} 取引先一覧
     */
    getPartners(page?: number, perPage?: number): MfInvoiceApi.PartnersResponse;
    /**
     * 取引先の作成
     * @param {MfInvoiceApi.PartnerReqBody} partnerReqBody 取引先リクエストボディ
     * @returns {MfInvoiceApi.Partner} 取引先
     */
    createNew(
      partnerReqBody: MfInvoiceApi.PartnerReqBody
    ): MfInvoiceApi.Partner;
    /**
     * 取引先の取得
     * @param {string} partnerId 取引先ID
     * @returns {MfInvoiceApi.Partner} 取引先
     */
    getPartner(partnerId: string): MfInvoiceApi.Partner;
    /**
     * 取引先の更新
     * @param {string} partnerId 取引先ID
     * @param {MfInvoiceApi.PartnerReqBody} partnerReqBody 取引先リクエストボディ
     * @returns {MfInvoiceApi.Partner} 取引先
     */
    updatePartner(
      partnerId: string,
      partnerReqBody: MfInvoiceApi.PartnerReqBody
    ): MfInvoiceApi.Partner;
    /**
     * 取引先の削除
     * @param partnerId 取引先ID
     * @returns {boolean} 削除成功時はtrue
     */
    deletePartner(partnerId: string): boolean;
    /**
     * 取引先に紐づく部署一覧の取得
     * @param {string} partnerId 取引先ID
     * @param {number} page ページ番号
     * @param {number} perPage 1ページあたりのデータ数
     * @returns {MfInvoiceApi.DepartmentsResponse} 取引先部署一覧
     */
    getDepartments(
      partnerId: string,
      page?: number,
      perPage?: number
    ): MfInvoiceApi.DepartmentsResponse;
    /**
     * 取引先に部署を追加
     * @param {string} partnerId 取引先ID
     * @param {MfInvoiceApi.DepartmentReqBody} departmentReqBody 取引先部署リクエストボディ
     * @returns {MfInvoiceApi.Department} 取引先部署
     */
    createDepartment(
      partnerId: string,
      departmentReqBody: MfInvoiceApi.DepartmentReqBody
    ): MfInvoiceApi.Department;
    /**
     * 取引先に紐づく部署の取得
     * @param {string} partnerId 取引先ID
     * @param {string} departmentId 取引先部署ID
     * @returns {MfInvoiceApi.Department} 取引先部署
     */
    getDepartment(
      partnerId: string,
      departmentId: string
    ): MfInvoiceApi.Department;
    /**
     * 取引先に紐づく部署の更新
     * @param {string} partnerId 取引先ID
     * @param {string} departmentId 取引先部署ID
     * @param {MfInvoiceApi.DepartmentReqBody} departmentReqBody 取引先部署リクエストボディ
     * @returns {MfInvoiceApi.Department} 取引先部署
     */
    updateDepartment(
      partnerId: string,
      departmentId: string,
      departmentReqBody: MfInvoiceApi.DepartmentReqBody
    ): MfInvoiceApi.Department;
    /**
     * 取引先に紐づく部署の削除
     * @param {string} partnerId 取引先ID
     * @param {string} departmentId 取引先部署ID
     * @returns {boolean} 削除成功時はtrue
     */
    deleteDepartment(partnerId: string, departmentId: string): boolean;
    /**
     * 全ての取引先を取得
     * MAX_PAGES(100ページ)を超える場合は打ち切り、取得できた分のみを返す(console.errorで警告出力)
     * @returns {MfInvoiceApi.Partner[]} 取引先一覧
     */
    getAll(): MfInvoiceApi.Partner[];
  }

  //== items(品目API) ==//

  interface ItemService extends ServiceBase {
    baseUrl: string;
    /**
     * 品目一覧の取得
     * @param {number} page ページ番号
     * @param {number} perPage 1ページあたりのデータ数
     * @param {string} name 品目名で絞り込む(部分一致、カンマ区切りで複数指定可)
     * @param {string} code 品目コードで絞り込む(カンマ区切りで複数指定可)
     * @returns {MfInvoiceApi.ItemsResponse} 品目一覧レスポンス
     */
    getItems(
      page?: number,
      perPage?: number,
      name?: string,
      code?: string
    ): MfInvoiceApi.ItemsResponse;
    /**
     * 品目の作成
     * @param {MfInvoiceApi.ItemReqBody} itemReqBody 品目リクエストボディ
     * @returns {MfInvoiceApi.Item} 品目
     */
    createNew(itemReqBody: MfInvoiceApi.ItemReqBody): MfInvoiceApi.Item;
    /**
     * 品目の取得
     * @param {string} itemId 品目ID
     * @returns {MfInvoiceApi.Item} 品目
     */
    getItem(itemId: string): MfInvoiceApi.Item;
    /**
     * 品目の削除
     * @param {string} itemId 品目ID
     * @returns {boolean} 成功時はtrue
     */
    deleteItem(itemId: string): boolean;
    /**
     * 品目の更新(部分更新可、全フィールド任意)
     * @param {string} itemId 品目ID
     * @param {MfInvoiceApi.ItemUpdateReqBody} itemReqBody 品目更新リクエストボディ
     * @returns {MfInvoiceApi.Item} 品目
     */
    updateItem(
      itemId: string,
      itemReqBody: MfInvoiceApi.ItemUpdateReqBody
    ): MfInvoiceApi.Item;
  }

  //== office(事業所API) ==//

  interface OfficeService extends ServiceBase {
    baseUrl: string;
    /**
     * 事業者情報の取得
     * @returns {MfInvoiceApi.Office} 事業者情報
     */
    getMyOffice(): MfInvoiceApi.Office;
    /**
     * 事業者情報の更新
     * @param {MfInvoiceApi.OfficeReqBody} officeReqBody 事業者情報リクエストボディ
     * @returns {MfInvoiceApi.Office} 更新後の事業者情報
     */
    updateOffice(
      officeReqBody: MfInvoiceApi.OfficeReqBody
    ): MfInvoiceApi.Office;
    /**
     * 適格請求書発行事業者番号の作成・更新
     * @param {string} registrationCode 適格請求書発行事業者番号(T+13桁)
     * @returns {MfInvoiceApi.RegistrationCodeResponse} 登録番号レスポンス
     */
    updateRegistrationCode(
      registrationCode: string
    ): MfInvoiceApi.RegistrationCodeResponse;
    /**
     * 適格請求書発行事業者番号の削除
     * @returns {boolean} 削除成功時はtrue
     */
    deleteRegistrationCode(): boolean;
  }

  //== sentHistories(送付履歴API) ==//

  interface SentHistoryService extends ServiceBase {
    baseUrl: string;
    /**
     * 送付履歴一覧の取得
     * @param {number} page ページ番号
     * @param {number} perPage 1ページあたりのデータ数
     * @returns {MfInvoiceApi.SentHistoriesResponse} 送付履歴一覧レスポンス
     */
    getSentHistories(
      page?: number,
      perPage?: number
    ): MfInvoiceApi.SentHistoriesResponse;
  }

  //== モデル / DTO ==//

  /**
   * PaginationData
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/PaginationData
   */
  interface PaginationData {
    total_count: number;
    total_pages: number;
    per_page: number;
    current_page: number;
  }

  /**
   * BillingItem
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/BillingItem
   */
  interface BillingItem {
    id: string;
    name: string;
    code: string;
    detail?: string;
    unit?: string;
    price?: string;
    quantity?: string;
    is_deduct_withholding_tax?: boolean;
    excise?: string;
    created_at: string;
    updated_at: string;
    delivery_number?: string;
    delivery_date?: string;
  }

  /**
   * 請求書の品目作成のリクエストボディ
   * item_id未指定の場合はname(+excise)を指定して新規品目として追加できる
   */
  interface BillingItemReqBody {
    item_id?: string;
    name?: string;
    delivery_number?: string;
    delivery_date?: string;
    detail?: string;
    unit?: string;
    price?: number;
    quantity?: number;
    is_deduct_withholding_tax?: boolean;
    excise?: Excise;
  }

  /**
   * Billing
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Billing
   *
   * 注意(既知の齟齬): getBillings() の実際のレスポンスは本 interface (Billing) の配列だが、
   * `BillingsResponse.data` の宣言型は `BillingItem[]` になっている(src/@types/mf-invoice-api.d.ts)。
   * getBillingItems() は正しく BillingItem の一覧を返す。エージェントは README のサンプル出力
   * (billings.data[0] の実データ形)を優先して扱うこと。
   */
  interface Billing {
    id: string;
    pdf_url: string;
    operator_id: string;
    department_id: string;
    member_id: string;
    member_name: string;
    partner_id: string;
    partner_name: string;
    office_id?: string;
    office_name: string;
    office_detail: string;
    title: string;
    memo?: string;
    payment_condition?: string;
    billing_date: string;
    due_date: string;
    sales_date?: string;
    billing_number?: string;
    note?: string;
    document_name?: string;
    payment_status?: string;
    email_status?: string;
    posting_status?: string;
    created_at: string;
    updated_at?: string;
    is_downloaded?: boolean;
    is_locked?: boolean;
    deduct_price?: string;
    tag_names?: string[];
    items?: BillingItem[];
    excise_price: string;
    excise_price_of_untaxable?: string;
    excise_price_of_non_taxable?: string;
    excise_price_of_tax_exemption?: string;
    excise_price_of_five_percent?: string;
    excise_price_of_eight_percent?: string;
    excise_price_of_eight_percent_as_reduced_tax_rate?: string;
    excise_price_of_ten_percent?: string;
    subtotal_price: string;
    subtotal_of_untaxable_excise?: string;
    subtotal_of_non_taxable_excise?: string;
    subtotal_of_tax_exemption_excise?: string;
    subtotal_of_five_percent_excise?: string;
    subtotal_of_eight_percent_excise?: string;
    subtotal_of_eight_percent_as_reduced_tax_rate_excise?: string;
    subtotal_of_ten_percent_excise?: string;
    subtotal_with_tax_of_untaxable_excise?: string;
    subtotal_with_tax_of_non_taxable_excise?: string;
    subtotal_with_tax_of_tax_exemption_excise?: string;
    subtotal_with_tax_of_five_percent_excise?: string;
    subtotal_with_tax_of_eight_percent_excise?: string;
    subtotal_with_tax_of_eight_percent_as_reduced_tax_rate_excise?: string;
    subtotal_with_tax_of_ten_percent_excise?: string;
    total_price: string;
    registration_code?: string;
    use_invoice_template: boolean;
    config?: BillingConfig;
  }

  /**
   * 請求書作成のリクエストボディ
   */
  interface BillingReqBody {
    department_id: string;
    title?: string;
    memo?: string;
    payment_condition?: string;
    billing_date: string;
    due_date?: string;
    sales_date?: string;
    billing_number?: string;
    note?: string;
    document_name?: string;
    tag_names?: string[];
    items?: BillingItemReqBody[];
  }

  /**
   * 請求書の詳細設定
   */
  interface BillingConfig {
    rounding: string;
    rounding_consumption_tax: string;
    consumption_tax_display_type: string;
  }

  /**
   * 請求書ステータス更新のリクエストボディ
   */
  interface BillingUpdateReqBody {
    department_id?: string;
    title?: string;
    memo?: string;
    payment_condition?: string;
    billing_date?: string;
    due_date?: string;
    sales_date?: string;
    billing_number?: string;
    note?: string;
    document_name?: string;
    tag_names?: string[];
  }

  /**
   * Get Billings
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/operations/get-billings
   */
  interface BillingsResponse {
    data: BillingItem[];
    pagination: PaginationData;
  }

  /**
   * Quote
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Quote
   */
  interface Quote {
    id: string;
    pdf_url: string;
    operator_id: string;
    department_id: string;
    member_id: string;
    member_name: string;
    partner_id: string;
    partner_name: string;
    partner_detail?: string;
    office_id?: string;
    office_name: string;
    office_detail: string;
    title: string;
    memo?: string;
    quote_date: string;
    quote_number?: string;
    note?: string;
    expired_date: string;
    document_name?: string;
    order_status?: string;
    transmit_status?: string;
    posting_status?: string;
    created_at: string;
    updated_at?: string;
    is_downloaded?: boolean;
    is_locked?: boolean;
    deduct_price?: string;
    tag_names?: string[];
    items: Item[];
    excise_price: string;
    excise_price_of_untaxable?: string;
    excise_price_of_non_taxable?: string;
    excise_price_of_tax_exemption?: string;
    excise_price_of_five_percent?: string;
    excise_price_of_eight_percent?: string;
    excise_price_of_eight_percent_as_reduced_tax_rate?: string;
    excise_price_of_ten_percent?: string;
    subtotal_price: string;
    subtotal_of_untaxable_excise?: string;
    subtotal_of_non_taxable_excise?: string;
    subtotal_of_tax_exemption_excise?: string;
    subtotal_of_five_percent_excise?: string;
    subtotal_of_eight_percent_excise?: string;
    subtotal_of_eight_percent_as_reduced_tax_rate_excise?: string;
    subtotal_of_ten_percent_excise?: string;
    total_price: string;
  }

  /**
   * 見積書作成の品目リクエストボディ
   * item_id未指定の場合はname(+excise)を指定して新規品目として追加できる
   */
  interface QuoteItemReqBody {
    item_id?: string;
    name?: string;
    detail?: string;
    unit?: string;
    price?: number;
    quantity?: number;
    is_deduct_withholding_tax?: boolean;
    excise?: Excise;
  }

  /**
   * 見積書作成時のリクエストボディ
   */
  interface QuoteReqBody {
    department_id: string;
    quote_number?: string;
    title?: string;
    memo?: string;
    quote_date: string;
    expired_date: string;
    note?: string;
    tag_names?: string[];
    document_name?: string;
    items?: QuoteItemReqBody[];
  }

  /**
   * Get Quotes
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/operations/get-quotes
   */
  interface QuotesResponse {
    data: Quote[];
    pagination: PaginationData;
  }

  /**
   * QuoteItem
   */
  interface QuoteItemResponse {
    data: Item[];
    pagination: PaginationData;
  }

  /**
   * 見積書一覧取得の絞込パラメータ(qを指定した場合はこれらは検索に使用されない)
   */
  interface QuoteListFilters {
    partnerId?: string;
    documentNumber?: string;
    status?: string;
    partnerName?: string;
    tags?: string;
  }

  /**
   * Department
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Department
   */
  interface Department {
    id: string;
    zip?: string;
    tel?: string;
    prefecture?: string;
    address1?: string;
    address2?: string;
    person_name?: string;
    person_title?: string;
    person_dept?: string;
    email?: string;
    cc_emails?: string;
    peppol_id?: string;
    office_member_id?: string;
    office_member_name?: string;
    created_at?: string;
    updated_at?: string;
  }

  /**
   * 取引先部署一覧レスポンス
   */
  interface DepartmentsResponse {
    data: Department[];
    pagination: PaginationData;
  }

  /**
   * Item
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Item
   */
  interface Item {
    id: string;
    name: string;
    code: string;
    detail?: string;
    unit?: string;
    price?: string;
    quantity?: string;
    is_deduct_withholding_tax?: boolean;
    excise?: MfInvoiceApi.Excise;
    created_at: string;
    updated_at: string;
  }

  /**
   * 品目作成のリクエストボディ
   */
  interface ItemReqBody {
    name: string;
    code?: string;
    detail?: string;
    unit?: string;
    price?: number;
    quantity?: number;
    is_deduct_withholding_tax?: boolean;
    excise: Excise;
  }

  /**
   * 品目更新のリクエストボディ(全フィールド任意、部分更新可)
   */
  type ItemUpdateReqBody = Partial<ItemReqBody>;

  /**
   * Office
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Office
   */
  interface Office {
    id: string;
    name?: string;
    zip?: string;
    prefecture?: string;
    address1?: string;
    address2?: string;
    tel?: string;
    fax?: string;
    office_type?: string;
    office_code?: string;
    registration_code?: string;
    created_at: string;
    updated_at: string;
  }

  /**
   * 事業者情報更新のリクエストボディ(全フィールド任意、少なくとも1項目指定)
   */
  interface OfficeReqBody {
    name?: string;
    zip?: string;
    prefecture?: string;
    address1?: string;
    address2?: string;
    tel?: string;
    fax?: string;
  }

  /**
   * 適格請求書発行事業者番号のレスポンス
   */
  interface RegistrationCodeResponse {
    registration_code: string;
  }

  /**
   * 取引先部署の作成・更新のリクエストボディ(全フィールド任意、少なくとも1項目指定)
   */
  interface DepartmentReqBody {
    zip?: string;
    tel?: string;
    prefecture?: string;
    address1?: string;
    address2?: string;
    person_name?: string;
    person_title?: string;
    person_dept?: string;
    office_member_name?: string;
    email?: string;
    cc_emails?: string;
    peppol_id?: string;
  }

  /**
   * 支払期日設定
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/PaymentDeadlineSetting
   */
  interface PaymentDeadlineSetting {
    due_month:
      | 'this_month'
      | 'next_month'
      | 'two_months_after'
      | 'three_months_after'
      | 'four_months_after'
      | 'five_months_after'
      | 'six_months_after';
    due_date: number;
    contingency_day: 'move_to_earlier_day' | 'keep_as_is' | 'move_to_later_day';
  }

  /**
   * Partner
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Partner
   */
  interface Partner {
    id: string;
    code?: string;
    name: string;
    name_kana?: string;
    name_suffix?: string;
    memo?: string;
    created_at: string;
    updated_at: string;
    departments: Department[];
    payment_deadline_setting?: PaymentDeadlineSetting | null;
  }

  /**
   * 取引先作成のリクエストボディ
   */
  interface PartnerReqBody {
    code?: string;
    name: string;
    name_kana?: string;
    name_suffix?: string;
    memo?: string;
    departments?: DepartmentReqBody[];
  }

  /**
   * 取引先レスポンス
   */
  interface PartnersResponse {
    data: Partner[];
    pagination: PaginationData;
  }

  /**
   * 品目レスポンス
   */
  interface ItemsResponse {
    data: Item[];
    pagination: PaginationData;
  }

  /**
   * SentHistory(送付履歴)
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/SentHistory
   */
  interface SentHistory {
    id: number;
    type: string;
    operator_id: string;
    document_type: string;
    document_id: string;
    from: string;
    to: string;
    cc: string;
    sender_name: string;
    replay_to: string;
    sent_at: string;
  }

  /**
   * 送付履歴一覧レスポンス
   */
  interface SentHistoriesResponse {
    data: SentHistory[];
    pagination: PaginationData;
  }
}
