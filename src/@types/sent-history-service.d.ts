/**
 * Copyright 2026 wywy LLC and contributors
 */
declare namespace MfInvoiceApi {
  interface SentHistoryService extends ServiceBase {
    /**
     * baseUrl
     */
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
}
