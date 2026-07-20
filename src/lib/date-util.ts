/**
 * Copyright 2026 wywy LLC and contributors
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
      case 2:
        return `${year}${month.toString().padStart(2, '0')}`;
      case 3:
        return `${year}年${month}月`;
      case 1:
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
    return this.formatEndOfMonth(1);
  }

  /**
   * 先月末の文字列を取得します。
   * @return {string} 先月末日付((YYYY-MM-DD)
   */
  getEndDateLastMonth(): string {
    return this.formatEndOfMonth(0);
  }

  /**
   * 来月末日付の文字列を取得します。
   * @return {string} 来月末日付(YYYY-MM-DD)
   */
  getEndDateNextMonth(): string {
    return this.formatEndOfMonth(2);
  }

  /**
   * 基準日からmonthOffsetヶ月後の月末日付の文字列を取得します。
   * @param {number} monthOffset 基準月からのオフセット
   * @return {string} 月末日付(YYYY-MM-DD)
   */
  private formatEndOfMonth(monthOffset: number): string {
    const lastDay = new Date(
      this.baseDate.getFullYear(),
      this.baseDate.getMonth() + monthOffset,
      0
    );
    return `${lastDay.getFullYear()}-${(lastDay.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`;
  }
}
