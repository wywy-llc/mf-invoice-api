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
/**
 * 日付ユーティリティクラス
 */
export class DateUtil {
  private baseDate: Date;

  /**
   * コンストラクタ
   * @param {Date} baseDate 基準日付
   */
  constructor(baseDate: Date) {
    this.baseDate = baseDate;
  }

  /**
   * 日付文字列を取得します。
   * @param {number} type 出力パターン
   * 1: YYYY-MM-DD
   * 2: YYYYMM
   * 3: YYYY年MM月
   * @return {string} 日付文字列
   */
  getDateString(type = 1): string {
    const year = this.baseDate.getFullYear();
    const month = this.baseDate.getMonth() + 1;
    const date = this.baseDate.getDate();
    switch (type) {
      case 1:
        return `${year}-${month.toString().padStart(2, '0')}-${date
          .toString()
          .padStart(2, '0')}`;
      case 2:
        return `${year}${month.toString().padStart(2, '0')}`;
      case 3:
        return `${year}年${month}月`;
      default:
        return `${year}-${month.toString().padStart(2, '0')}-${date
          .toString()
          .padStart(2, '0')}`;
    }
  }

  /**
   * 時刻文字列を取得します。
   * @return {string} 本日日付(YYYY-MM-DD hh:mm:dd)
   */
  getTimeString(): string {
    const year = this.baseDate.getFullYear();
    const month = this.baseDate.getMonth() + 1;
    const date = this.baseDate.getDate();
    const hours = this.baseDate.getHours();
    const minutes = this.baseDate.getMinutes();
    const seconds = this.baseDate.getSeconds();
    return `${year}-${month.toString().padStart(2, '0')}-${date
      .toString()
      .padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * 月末日付の文字列を取得します。
   * @return {string} 今月末日付((YYYY-MM-DD)
   */
  getEndDateBaseMonth(): string {
    const nextMonthLastDay = new Date(
      this.baseDate.getFullYear(),
      this.baseDate.getMonth() + 1,
      0
    );
    return `${nextMonthLastDay.getFullYear()}-${(
      nextMonthLastDay.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${nextMonthLastDay
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  /**
   * 先月末の文字列を取得します。
   * @return {string} 先月末日付((YYYY-MM-DD)
   */
  getEndDateLastMonth(): string {
    const lastMonthLastDay = new Date(
      this.baseDate.getFullYear(),
      this.baseDate.getMonth(),
      0
    );
    return `${lastMonthLastDay.getFullYear()}-${(
      lastMonthLastDay.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${lastMonthLastDay
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }

  /**
   * 来月末日付の文字列を取得します。
   * @return {string} 来月末日付(YYYY-MM-DD)
   */
  getEndDateNextMonth() {
    const nextMonthLastDay = new Date(
      this.baseDate.getFullYear(),
      this.baseDate.getMonth() + 2,
      0
    );
    return `${nextMonthLastDay.getFullYear()}-${(
      nextMonthLastDay.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${nextMonthLastDay
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }
}
