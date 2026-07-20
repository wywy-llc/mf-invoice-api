/**
 * Copyright 2026 wywy LLC and contributors
 */
import { ReqMethod, ServiceBase } from './service-base';

/**
 * SentHistoryService
 */
export class SentHistoryService extends ServiceBase {
  /**
   * baseUrl
   */
  baseUrl: string = ServiceBase.API_BASE_URL + '/sent_histories';

  /**
   * 送付履歴一覧の取得
   * @param {number} page ページ番号
   * @param {number} perPage 1ページあたりのデータ数
   * @returns {MfInvoiceApi.SentHistoriesResponse} 送付履歴一覧レスポンス
   */
  getSentHistories(
    page: number = 1,
    perPage: number = 100
  ): MfInvoiceApi.SentHistoriesResponse {
    const reqUrl = `${this.baseUrl}?page=${page}&per_page=${perPage}`;
    return this.request<MfInvoiceApi.SentHistoriesResponse>(
      reqUrl,
      ReqMethod.get
    );
  }
}
