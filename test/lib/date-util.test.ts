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
    it('1桁月を指定すると、typeに2を指定した際に月がゼロ埋めされる', () => {
      const janDateUtil = new DateUtil(new Date('2024/1/5'));
      result = janDateUtil.getDateString(2);
      expect(result).toBe('202401');
    });
  });

  it('getTimeStringを呼び出すと、"YYYY-MM-DD hh:mm:ss"形式の日時文字列を返す', () => {
    result = dateUtil.getTimeString();
    expect(result).toBe('2024-06-20 00:00:00');
  });

  it('時分秒が1桁の日時を指定すると、getTimeStringはゼロ埋めした文字列を返す', () => {
    const timeDateUtil = new DateUtil(new Date(2024, 5, 20, 9, 5, 3));
    result = timeDateUtil.getTimeString();
    expect(result).toBe('2024-06-20 09:05:03');
  });

  it('getEndDateBaseMonthを呼び出すと、今月末日付を返す', () => {
    result = dateUtil.getEndDateBaseMonth();
    expect(result).toBe('2024-06-30');
  });

  it('うるう年の2月を基準日とすると、getEndDateBaseMonthは2月29日を返す', () => {
    const leapFebDateUtil = new DateUtil(new Date('2024/2/10'));
    result = leapFebDateUtil.getEndDateBaseMonth();
    expect(result).toBe('2024-02-29');
  });

  it('平年の2月を基準日とすると、getEndDateBaseMonthは2月28日を返す', () => {
    const nonLeapFebDateUtil = new DateUtil(new Date('2023/2/10'));
    result = nonLeapFebDateUtil.getEndDateBaseMonth();
    expect(result).toBe('2023-02-28');
  });

  it('getEndDateLastMonthを呼び出すと、先月末日付を返す', () => {
    result = dateUtil.getEndDateLastMonth();
    expect(result).toBe('2024-05-31');
  });

  it('1月を基準日とすると、getEndDateLastMonthは前年12月末日付を返す', () => {
    const janDateUtil = new DateUtil(new Date('2024/1/15'));
    result = janDateUtil.getEndDateLastMonth();
    expect(result).toBe('2023-12-31');
  });

  it('getEndDateNextMonthを呼び出すと、来月末日付を返す', () => {
    result = dateUtil.getEndDateNextMonth();
    expect(result).toBe('2024-07-31');
  });

  it('12月を基準日とすると、getEndDateNextMonthは翌年1月末日付を返す', () => {
    const decDateUtil = new DateUtil(new Date('2024/12/10'));
    result = decDateUtil.getEndDateNextMonth();
    expect(result).toBe('2025-01-31');
  });
});
