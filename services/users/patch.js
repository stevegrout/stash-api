const { users } = require('../queries');

patchUserHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  const { username, age } = req.body;

  await req.pool.query(users.updateUser, [username, age, id]);
  res
    .status(200)
    .send({ message: `User modified with ID: ${id}`});
};

module.exports = patchUserHandler;
