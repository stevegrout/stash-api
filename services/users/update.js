const { users } = require('../db/sql');

updateUserHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  const { username, age } = req.body;

  await req.pool.query(users.updateUser, [username, age, id]);
  res
    .status(200)
    .json({ msg: `User modified with ID: ${id}`});
};

module.exports = updateUserHandler;
