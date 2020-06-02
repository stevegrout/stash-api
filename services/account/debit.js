const { transactions } = require('../queries');

storeDebitHandler = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { amount, description } = req.body;

  await req.pool.query(transactions.store, [
    userId,
    amount,
    'debit',
    description,
    new Date(),
  ]);
  res.status(201).json({
    msg: 'debit added',
  });
};

module.exports = storeDebitHandler;
