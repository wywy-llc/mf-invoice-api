import { DateUtil } from '../../src/lib/date-util';

describe('DateUtil', () => {
  let result: string;

  describe('getNow', () => {
    test('現在時刻の文字列を取得できること', () => {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
      result = DateUtil.getNow();
      console.log(result);
      expect(todayStr === result).toBe(true);
    });
    test('YYYY-MM-DD hh:mm:ddの形式で取得できること', () => {
      result = DateUtil.getNow();
      console.log(result);
      expect(result).toMatch(/^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/);
    });
  });
  describe('getThisMonthLastDay', () => {
    test('今月末の文字列を取得できること', () => {
      const today = new Date();
      const nextMonthLastDay = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      const nextMonthLastDayStr = `${nextMonthLastDay.getFullYear()}-${
        nextMonthLastDay.getMonth() + 1
      }-${nextMonthLastDay.getDate()}`;
      result = DateUtil.getThisMonthLastDay();
      console.log(result);
      expect(nextMonthLastDayStr === result).toBe(true);
    });
  });
  describe('getThisMonthDay', () => {
    let type;
    let dateStr;
    const dateNum = 20;
    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth(), dateNum);

    test('今月の指定日の文字列(YYYY-MM-DD)を取得できること。type=1', () => {
      type = 1;
      dateStr = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      result = DateUtil.getThisMonthDay(dateNum, type);
      console.log(result);
      expect(dateStr === result).toBe(true);
    });
    test('今月の指定日の文字列(YYYYMM)を取得できること。type=2', () => {
      type = 2;
      dateStr = `${date.getFullYear()}${date.getMonth() + 1}`;
      result = DateUtil.getThisMonthDay(dateNum, type);
      console.log(result);
      expect(dateStr === result).toBe(true);
    });
  });
  describe('getLastMonthLastDay', () => {
    test('先月末の文字列を取得できること', () => {
      const today = new Date();
      const lastMonthLastDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      );
      const lastMonthLastDayStr = `${lastMonthLastDay.getFullYear()}-${
        lastMonthLastDay.getMonth() + 1
      }-${lastMonthLastDay.getDate()}`;
      result = DateUtil.getLastMonthLastDay();
      console.log(result);
      expect(lastMonthLastDayStr === result).toBe(true);
    });
  });
  describe('getNextMonthLastDay', () => {
    test('来月末日付の文字列を取得できること', () => {
      const today = new Date();
      const nextMonthLastDay = new Date(
        today.getFullYear(),
        today.getMonth() + 2,
        0
      );
      const nextMonthLastDayStr = `${nextMonthLastDay.getFullYear()}-${
        nextMonthLastDay.getMonth() + 1
      }-${nextMonthLastDay.getDate()}`;
      result = DateUtil.getNextMonthLastDay();
      console.log(result);
      expect(nextMonthLastDayStr === result).toBe(true);
    });
  });
});
