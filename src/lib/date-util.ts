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
