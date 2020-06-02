const { transactions } = require('../queries');

getAllTransactionsHandler = async (req, res) => {
  const { rows } = await req.pool.query(transactions.getAll);
  res.status(200).json(rows);
};

module.exports = getAllTransactionsHandler;
