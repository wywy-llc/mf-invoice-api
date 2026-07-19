/**
 * Copyright 2026 wywy LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
declare namespace MfInvoiceApi {
  /**
   * MF請求書APIクライアントを生成します。
   * @param {string} clientId クライアントID
   * @param {string} clientSecret クライアントシークレット
   * @returns {MfInvoiceApi.MfClient} MF請求書APIクライアント
   */
  declare function createClient(
    clientId: string,
    clientSecret: string
  ): MfInvoiceApi.MfInvoiceClient;
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
}
