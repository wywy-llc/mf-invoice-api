export class DateUtil {
  /**
   * 日付オブジェクトを文字列に変換します。
   * @param {string} date
   */
  static convertDateToString(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  /**
   * 日付オブジェクト(時間)を文字列に変換します。
   * @param {string} date
   */
  static convertDateTimeToString(date: Date) {
    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  /**
   * 日付文字列(時間)を整形します。
   * @param {string} date 日付文字列(時間)
   */
  static formatDateTimeString(date: string) {
    return date.replace('.000+09:00', '').replace('T', ' ');
  }

  /**
   * 本日日付の文字列を取得します。
   * @return {string} 本日日付((YYYY-MM-DD)
   */
  static getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }

  /**
   * 現在時刻の文字列を取得します。
   * @return {string} 本日日付((YYYY-MM-DD hh:mm:dd)
   */
  static getNow() {
    const today = new Date();
    return `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  }

  /**
   * 今月末の文字列を取得します。
   * @return {string} 今月末日付((YYYY-MM-DD)
   */
  static getThisMonthLastDay() {
    const today = new Date();
    const nextMonthLastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    return `${nextMonthLastDay.getFullYear()}-${
      nextMonthLastDay.getMonth() + 1
    }-${nextMonthLastDay.getDate()}`;
  }

  /**
   * 今月の指定日の文字列を取得します。
   * @param dateNum 指定日
   * @returns
   */
  static getThisMonthDay(dateNum: number) {
    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth() + 1, dateNum);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  /**
   * 先月末の文字列を取得します。
   * @return {string} 今月末日付((YYYY-MM-DD)
   */
  static getLastMonthLastDay(): string {
    const today = new Date();
    const lastMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0);
    return `${lastMonthLastDay.getFullYear()}-${
      lastMonthLastDay.getMonth() + 1
    }-${lastMonthLastDay.getDate()}`;
  }

  /**
   * 来月末日付の文字列を取得します。
   * @return {string} 来月末日付(YYYY-MM-DD)
   */
  static getNextMonthLastDay() {
    const today = new Date();
    const nextMonthLastDay = new Date(
      today.getFullYear() + 2,
      today.getMonth(),
      0
    );
    return `${nextMonthLastDay.getFullYear()}-${
      nextMonthLastDay.getMonth() + 1
    }-${nextMonthLastDay.getDate()}`;
  }
  /**
   * 請求番号を作成します。
   * パターン1：YYYYMMDD-hhmmdd
   * パターン2：YYYY-MMDD-hhmmdd
   * @return {string} 請求番号(YYYYMMDD-hhmmdd)
   */
  static getBillingNumber(pattern = 1) {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const date = today.getDate().toString().padStart(2, '0');
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const seconds = today.getSeconds().toString().padStart(2, '0');
    if (pattern === 2) {
      return `${today.getFullYear()}-${month}${date}-${hours}${minutes}${seconds}`;
    }
    return `${today.getFullYear()}${month}${date}-${hours}${minutes}${seconds}`;
  }
}
