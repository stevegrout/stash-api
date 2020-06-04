const {
  storeTransactionHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
} = require('./transaction');
const { users } = require('../db/sql');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Account Service [transaction]', () => {
  test('saves a credit to an account', async () => {
    const user = { username: 'test', balance: 0, user_id: 1 };
    const credit = { type: 'credit', amount: 25.5, description: 'pay' };
    const req = { params: { id: 1 }, body: credit };
    const res = mockResponse();

    const mockDbPool = jest.fn();
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [user] }));

    const mockDbClient = jest.fn();
    mockDbClient.mockReturnValueOnce(Promise.resolve({ rows: [credit] }));
    mockDbClient.mockReturnValueOnce(Promise.resolve());

    req.pool = {
      query: mockDbPool,
      connect: jest.fn(() =>
        Promise.resolve({ query: mockDbClient, release: jest.fn() })
      ),
    };

    await storeTransactionHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'credit added',
      balance: 25.5,
    });
  });

  test("sends an error if the user doesn't exist", async () => {
    const credit = { type: 'credit', amount: 25.5, description: 'pay' };
    const req = { params: { id: 1 }, body: credit };
    const res = mockResponse();

    const mockDbPool = jest.fn();
    mockDbPool.mockReturnValueOnce(Promise.reject({ error: 'user not found' }));

    const mockDbClient = jest.fn();
    req.pool = {
      query: mockDbPool,
      connect: jest.fn(() =>
        Promise.resolve({ query: mockDbClient, release: jest.fn() })
      ),
    };

    await expect (storeTransactionHandler(req, res, (err)=> { throw(err) })).rejects.toEqual({error: 'user not found'});

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(mockDbClient).not.toHaveBeenCalled();
  });

  test('increases the balance on the users account when credit transactions created', async () => {
    const user = { username: 'test', balance: 25.5 };
    const credit = { type: 'credit', amount: 20.48, description: 'pay me' };
    const req = { params: { id: 1 }, body: credit };
    const res = mockResponse();

    const mockDbPool = jest.fn();
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [user] }));

    const mockDbClient = jest.fn();
    mockDbClient.mockReturnValueOnce(Promise.resolve());
    mockDbClient.mockReturnValueOnce(Promise.resolve({ rows: [credit] }));

    req.pool = {
      query: mockDbPool,
      connect: jest.fn(() =>
        Promise.resolve({ query: mockDbClient, release: jest.fn() })
      ),
    };

    await storeTransactionHandler(req, res);

    expect(mockDbClient).toHaveBeenNthCalledWith(3, users.updateUserBalance, [45.98, 1]);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ balance: 45.98 })
    );
  });

  test('updates the balance on the users account when a credit transaction is updated', async () => {
    const existingCredit = { type: 'credit', amount: 120.55, description: 'pay', user_id: 1 };
    const user = { username: 'test', balance: 130.55 };
    const updatedCredit = { type: 'credit', amount: 25.52, description: 'pay' };
    const req = { params: { id: 1 }, body: updatedCredit };
    const res = mockResponse();

    const mockDbPool = jest.fn();
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [existingCredit] }));
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [user] }));

    const mockDbClient = jest.fn();
    mockDbClient.mockReturnValue(Promise.resolve());

    req.pool = {
      query: mockDbPool,
      connect: jest.fn(() =>
        Promise.resolve({ query: mockDbClient, release: jest.fn() })
      ),
    };

    await updateTransactionHandler(req, res);

    expect(mockDbClient).toHaveBeenNthCalledWith(3, users.updateUserBalance, [35.52, 1]);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ balance: 35.52 })
    );
  });

  test('updates the balance on the users account when a credit transaction is deleted', async () => {
    const existingCredit = { type: 'credit', amount: 120.55, description: 'pay', user_id: 1 };
    const user = { username: 'test', balance: 130.55 };
    const req = { params: { id: 1 } };
    const res = mockResponse();

    const mockDbPool = jest.fn();
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [existingCredit] }));
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [user] }));

    const mockDbClient = jest.fn();
    mockDbClient.mockReturnValue(Promise.resolve());

    req.pool = {
      query: mockDbPool,
      connect: jest.fn(() =>
        Promise.resolve({ query: mockDbClient, release: jest.fn() })
      ),
    };

    await deleteTransactionHandler(req, res);

    expect(mockDbClient).toHaveBeenNthCalledWith(3, users.updateUserBalance, [10.0, 1]);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ balance: 10.0 })
    );
  });
});
