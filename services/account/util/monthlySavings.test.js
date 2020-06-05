const { getNewSavingsAmount } = require('./monthlySavings');

const monthlyAverages = [
  { type: 'credit', avg: 120.55 },
  { type: 'debit', avg: 100.55 },
];

describe('monthlySavings', () => {

  describe('returns higher savings figures for younger users', () => {

    const cases = [[20, 16], [30, 14], [40, 12], [50, 10], [60, 8]];

    test.each(cases)('for a balance of 200 and avg monthly +20 for someone age %p returns %p', async (age, expectedResult) => {
      const balance = 200;

      const mockDbQuery = jest.fn();
      mockDbQuery.mockReturnValue(Promise.resolve({ rows: monthlyAverages }));
      const pool = { query: mockDbQuery };

      const newSavingsAmount = await getNewSavingsAmount(pool, 1, balance, age);
      expect(newSavingsAmount).toBe(expectedResult);
    });
  });

  test('returns a 0 savings figure with a balance < 100', async () => {
    const balance = 99;
    const age = 40;

    const mockDbQuery = jest.fn();
    mockDbQuery.mockReturnValue(Promise.resolve({ rows: monthlyAverages }));
    const pool = { query: mockDbQuery };

    const newSavingsAmount = await getNewSavingsAmount(pool, 1, balance, age);
    expect(newSavingsAmount).toBe(0);
  });

  test("returns a 0 savings figure for people who's average monthly outgoings are higher than their" +
    " average monthly incoming", async () => {
    const balance = 200;
    const age = 40;

    const mockDbQuery = jest.fn();
    mockDbQuery.mockReturnValue(Promise.resolve({ rows: monthlyAverages }));
    const pool = { query: mockDbQuery };

    const newSavingsAmount = await getNewSavingsAmount(pool, 1, balance, age);
    expect(newSavingsAmount).toBe(0);
  });

});
