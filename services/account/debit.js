const { storeTransaction } = require('../db/queries');

storeDebitHandler = async (req, res) => {
  const userId = parseInt(req.params.id);
  const { amount, description } = req.body;

  await storeTransaction(req.pool, userId, amount, 'debit', description, new Date());
  res.status(201).json({
    msg: 'debit added',
  });
};

module.exports = storeDebitHandler;
