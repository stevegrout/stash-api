const { transactions } = require('../queries');

storeCreditHandler = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { amount, description } = req.body;

  await req.pool.query(transactions.store, [
    userId,
    amount,
    'credit',
    description,
    new Date(),
  ]);
  res.status(201).json({
    msg: 'credit added',
  });
};

module.exports = storeCreditHandler;
