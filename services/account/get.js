const { transactions } = require('../db/sql');

getAllTransactionsHandler = async (req, res) => {
  const { rows } = await req.pool.query(transactions.getAll);
  res.status(200).json(rows);
};

getTransactionHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  const { rows } = await req.pool.query(transactions.get, [id]);
  return rows.length === 0
    ? res.status(404).json({ msg: `Transaction not found with id: ${id}` })
    : res.status(200).json(rows);
};

module.exports = {
  getTransactionHandler,
  getAllTransactionsHandler
};
