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
}
