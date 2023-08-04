import { DateUtil } from '../../src/lib/date-util';

describe('DateUtil', () => {
  let result: string;
  const baseDate = new Date('2024/6/20');
  const dateUtil = new DateUtil(baseDate);

  describe('getDateString', () => {
    test('type=1', () => {
      result = dateUtil.getDateString(1);
      expect(result).toBe('2024-06-20');
    });
    test('type=2', () => {
      result = dateUtil.getDateString(2);
      expect(result).toBe('202406');
    });
    test('type=3', () => {
      result = dateUtil.getDateString(3);
      expect(result).toBe('2024年6月');
    });
    test('type=other', () => {
      result = dateUtil.getDateString(4);
      expect(result).toBe('2024-06-20');
    });
  });

  test('getTimeString', () => {
    result = dateUtil.getTimeString();
    expect(result).toBe('2024-06-20 00:00:00');
  });

  test('getEndDateBaseMonth', () => {
    result = dateUtil.getEndDateBaseMonth();
    expect(result).toBe('2024-06-30');
  });

  test('getEndDateLastMonth', () => {
    result = dateUtil.getEndDateLastMonth();
    expect(result).toBe('2024-05-31');
  });

  test('getEndDateNextMonth', () => {
    result = dateUtil.getEndDateNextMonth();
    expect(result).toBe('2024-07-31');
  });
});
