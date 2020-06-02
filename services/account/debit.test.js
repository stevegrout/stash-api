const storeDebitHandler = require('./debit');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const res = mockResponse();
const mockDbPool = jest.fn();

describe('Account Service [debit]', () => {
  test('saves a debit to an account', async () => {
    const debit = { amount: 25.5, description: 'food' };
    const req = { params: { id: 1 }, body: debit };
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [debit] }));
    req.pool = { query: mockDbPool };

    await storeDebitHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ msg: 'debit added' });
  });
});
