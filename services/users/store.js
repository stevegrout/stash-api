const { users } = require('../queries');

storeUserHandler = async (req, res) => {
  const { username, age } = req.body;

  const { rows } = await req.pool.query(users.storeUser, [username, age]);
  res.status(201).json({
    msg: 'user created',
    user: rows[0],
  });
};

module.exports = storeUserHandler;
