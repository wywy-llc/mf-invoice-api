import { DateUtil } from '../../src/lib/date-util';

describe('DateUtil', () => {
  let result: string;
  const baseDate = new Date('2024/6/20');
  const dateUtil = new DateUtil(baseDate);

  describe('getDateString', () => {
    it('typeに1を指定すると、"YYYY-MM-DD"形式の日付文字列を返す', () => {
      result = dateUtil.getDateString(1);
      expect(result).toBe('2024-06-20');
    });
    it('typeに2を指定すると、"YYYYMM"形式の日付文字列を返す', () => {
      result = dateUtil.getDateString(2);
      expect(result).toBe('202406');
    });
    it('typeに3を指定すると、"YYYY年MM月"形式の日付文字列を返す', () => {
      result = dateUtil.getDateString(3);
      expect(result).toBe('2024年6月');
    });
    it('未定義のtypeを指定すると、デフォルトの"YYYY-MM-DD"形式の日付文字列を返す', () => {
      result = dateUtil.getDateString(4);
      expect(result).toBe('2024-06-20');
    });
  });

  it('getTimeStringを呼び出すと、"YYYY-MM-DD hh:mm:ss"形式の日時文字列を返す', () => {
    result = dateUtil.getTimeString();
    expect(result).toBe('2024-06-20 00:00:00');
  });

  it('getEndDateBaseMonthを呼び出すと、今月末日付を返す', () => {
    result = dateUtil.getEndDateBaseMonth();
    expect(result).toBe('2024-06-30');
  });

  it('getEndDateLastMonthを呼び出すと、先月末日付を返す', () => {
    result = dateUtil.getEndDateLastMonth();
    expect(result).toBe('2024-05-31');
  });

  it('getEndDateNextMonthを呼び出すと、来月末日付を返す', () => {
    result = dateUtil.getEndDateNextMonth();
    expect(result).toBe('2024-07-31');
  });
});
