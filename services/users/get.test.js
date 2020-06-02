const { getUserHandler, getAllUsersHandler } = require('./get');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const res = mockResponse();
const mockDbPool = jest.fn();

describe('Users Service [get]', () => {
  test('returns a user if they exist', async () => {
    const rows = [{ username: 'test' }];
    const req = { params: { id: 1 } };
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows }));
    req.pool = { query: mockDbPool };

    await getUserHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
  });

  test('returns a not found error if a user does not exist', async () => {
    const id = 1;
    const req = { params: { id } };
    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows: [] }));
    req.pool = { query: mockDbPool };

    await getUserHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: `User not found with id: ${id}` });
  });

  test('returns a list of all users', async () => {
    const rows = [{ username: 'test1' }, { username: 'test2' }];

    mockDbPool.mockReturnValueOnce(Promise.resolve({ rows }));
    const req = { pool: { query: mockDbPool }};

    await getAllUsersHandler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
  });

});
