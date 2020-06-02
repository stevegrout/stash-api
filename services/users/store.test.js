const storeUserHandler = require('./store');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const res = mockResponse();
const mockDbPool = jest.fn();

describe('Users Service [store]', () => {
  test('saves a user', async () => {
    const user = { username: 'test', age: 18 };
    const req = { body: user };
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [user] }));
    req.pool = { query: mockDbPool };

    await storeUserHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ msg: 'user created', user });
  });
});
