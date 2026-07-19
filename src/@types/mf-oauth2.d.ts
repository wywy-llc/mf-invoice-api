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
  interface MfOAuth2 {
    /**
     * OAuth2オブジェクトを取得します。
     * @returns {OAuth2} OAuth2オブジェクト
     */
    getMfService(): OAuth2.OAuth2Service;
    /**
     * MFからのコールバックリクエストを処理します。
     * @param {any} request コールバックリクエスト
     * @returns {GoogleAppsScript.HTML.HtmlOutput} HtmlOutput
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleCallback(request: any): GoogleAppsScript.HTML.HtmlOutput;
    /**
     * MF認証をリセットします。
     */
    logout(): void;
    /**
     * MF認証用のURLを取得します。
     * @returns {string} MF認証用のURL
     */
    getAuthorizationUrl(): string;
  }
}
