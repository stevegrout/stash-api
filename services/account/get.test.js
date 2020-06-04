const { getTransactionHandler, getAllTransactionsHandler } = require('./get');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Account Service [get]', () => {
  test('returns a transaction if it exists', async () => {
    const rows = [{ type: 'credit' }];
    const req = { params: { id: 1 } };
    const res = mockResponse();
    const mockDbPool = jest.fn();

    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows }));
    req.pool = { query: mockDbPool };

    await getTransactionHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
  });

  test('returns a not found error if a transaction does not exist', async () => {
    const id = 1;
    const req = { params: { id } };
    const res = mockResponse();
    const mockDbPool = jest.fn();

    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [] }));
    req.pool = { query: mockDbPool };

    await getTransactionHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: `Transaction not found with id: ${id}` });
  });

  test('returns a list of all transaction', async () => {
    const rows = [{ type: 'credit' }, { type: 'debit' }];
    const res = mockResponse();
    const mockDbPool = jest.fn();

    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows }));
    const req = { pool: { query: mockDbPool }};

    await getAllTransactionsHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
  });

});
