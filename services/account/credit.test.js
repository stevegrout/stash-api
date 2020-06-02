const {
  storeCreditHandler,
  patchCreditHandler,
  deleteCreditHandler,
} = require('./credit');
const { users } = require('../db/sql');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const res = mockResponse();

describe('Account Service [credit]', () => {
  test('saves a credit to an account', async () => {
    const user = { username: 'test', balance: 0, user_id: 1 };
    const credit = { amount: 25.5, description: 'pay' };
    const req = { params: { id: 1 }, body: credit };

    const mockDbPool = jest.fn();
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [user] }));

    const mockDbClient = jest.fn();
    mockDbClient.mockReturnValueOnce(Promise.resolve({ rows: [credit] }));
    mockDbClient.mockReturnValueOnce(Promise.resolve());

    req.pool = {
      query: mockDbPool,
      connect: jest.fn(() => Promise.resolve({ query: mockDbClient, release: jest.fn() })),
    };

    await storeCreditHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'credit added',
      balance: 25.5,
    });
  });

  test('increases the balance on the users account when credit transactions created', async () => {
    const user = { username: 'test', balance: 25.5 };
    const credit = { amount: 20.48, description: 'pay me' };
    const req = { params: { id: 1 }, body: credit };

    const mockDbPool = jest.fn();
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [user] }));

    const mockDbClient = jest.fn();
    mockDbClient.mockReturnValueOnce(Promise.resolve());
    mockDbClient.mockReturnValueOnce(Promise.resolve({ rows: [credit] }));

    req.pool = {
      query: mockDbPool,
      connect: jest.fn(() => Promise.resolve({ query: mockDbClient, release: jest.fn() })),
    };

    await storeCreditHandler(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ balance: 45.98 })
    );
  });

  test('updates the balance on the users account when a credit transaction is updated', async () => {
    const existingCredit = { amount: 120.55, description: 'pay', user_id: 1 };
    const user = { username: 'test', balance: 130.55 };
    const updatedCredit = { amount: 25.52, description: 'pay' };
    const req = { params: { id: 1 }, body: updatedCredit };

    const mockDbPool = jest.fn();
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [existingCredit] }));
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [user] }));

    const mockDbClient = jest.fn();
    mockDbClient.mockReturnValue(Promise.resolve());

    req.pool = {
      query: mockDbPool,
      connect: jest.fn(() => Promise.resolve({ query: mockDbClient, release: jest.fn() })),
    };

    await patchCreditHandler(req, res);

    expect(mockDbClient).toHaveBeenNthCalledWith(3, users.updateUserBalance, [35.52, 1]);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ balance: 35.52 })
    );
  });

  test('updates the balance on the users account when a credit transaction is deleted', async () => {
    const existingCredit = { amount: 120.55, description: 'pay', user_id: 1 };
    const user = { username: 'test', balance: 130.55 };
    const req = { params: { id: 1 } };

    const mockDbPool = jest.fn();
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [existingCredit] }));
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [user] }));

    const mockDbClient = jest.fn();
    mockDbClient.mockReturnValue(Promise.resolve());

    req.pool = {
      query: mockDbPool,
      connect: jest.fn(() => Promise.resolve({ query: mockDbClient, release: jest.fn() })),
    };

    await deleteCreditHandler(req, res);

    expect(mockDbClient).toHaveBeenNthCalledWith(3, users.updateUserBalance, [10.0, 1,]);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ balance: 10.0 })
    );
  });
});
