const updateUserHandler = require('./update');
const { users } = require('../db/sql');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Users Service [store]', () => {
  test('saves a user', async () => {
    const id = 1;
    const user = { username: 'test', age: 18 };
    const req = { params: { id }, body: user };
    const res = mockResponse();
    const mockDbPool = jest.fn();

    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [user] }));
    req.pool = { query: mockDbPool };

    await updateUserHandler(req, res);
    expect(mockDbPool).toHaveBeenCalledWith(users.updateUser, ['test', 18, id]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({msg: `User modified with ID: ${id}`});
  });
});
