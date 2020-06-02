const { users } = require('../db/sql');

getAllUsersHandler = async (req, res) => {
  const { rows } = await req.pool.query(users.getAllUsers);
  res.status(200).json(rows);
};

getUserHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  const { rows } = await req.pool.query(users.getUser, [id]);
  return rows.length === 0
    ? res.status(404).json({ msg: `User not found with id: ${id}` })
    : res.status(200).json(rows);
};

module.exports = {
  getAllUsersHandler,
  getUserHandler,
};
