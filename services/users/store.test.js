const storeUserHandler = require('./store');
const { users } = require('../db/sql');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Users Service [store]', () => {
  test('saves a user', async () => {
    const user = { username: 'test', age: 18 };
    const req = { body: user };
    const res = mockResponse();
    const mockDbPool = jest.fn();

    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [user] }));
    req.pool = { query: mockDbPool };

    await storeUserHandler(req, res);

    expect(mockDbPool).toHaveBeenCalledWith(users.storeUser, ['test', 18]);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ msg: 'user created', user });
  });
});
