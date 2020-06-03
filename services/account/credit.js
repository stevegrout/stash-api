const {
  getTransaction,
  storeTransaction,
  updateTransaction,
  updateUserBalance,
  deleteTransaction,
  getUserBalance,
} = require('../db/queries');

const { executeTransaction } = require('../db/transaction');

storeCreditHandler = async (req, res, next) => {
  const { pool } = req;
  const userId = parseInt(req.params.id);
  const { amount, description } = req.body;

  let existingBalance;
  try {
    existingBalance = await getUserBalance(pool, userId);
  } catch (err) {
    next(err);
  }
  const newBalance = Number.parseFloat((existingBalance + amount).toFixed(2));

  await executeTransaction(pool, [
    (client) => storeTransaction(client, userId, amount, 'credit', description, new Date()),
    (client) => updateUserBalance(client, userId, newBalance),
  ]);

  res.status(201).json({
    msg: 'credit added',
    balance: newBalance,
  });
};

patchCreditHandler = async (req, res) => {
  const { pool } = req;
  const id = parseInt(req.params.id);
  const { amount, description } = req.body;

  const existingTransaction = await getTransaction(pool, id);
  const userId = existingTransaction.user_id;
  const existingBalance = await getUserBalance(pool, userId);

  const newBalance = Number.parseFloat(
    (existingBalance + amount - existingTransaction.amount).toFixed(2)
  );

  await executeTransaction(pool, [
    (client) => updateTransaction(client, id, amount, description),
    (client) => updateUserBalance(client, userId, newBalance),
  ]);

  res
    .status(200)
    .json({ msg: `updated transaction ID: ${id}`, balance: newBalance });
};

deleteCreditHandler = async (req, res) => {
  const { pool } = req;
  const id = parseInt(req.params.id);

  const transaction = await getTransaction(pool, id);
  const userId = transaction.user_id;
  const existingBalance = await getUserBalance(pool, userId);

  const newBalance = Number.parseFloat(
    (existingBalance - transaction.amount).toFixed(2)
  );

  await executeTransaction(pool, [
    (client) => deleteTransaction(client, id),
    (client) => updateUserBalance(client, userId, newBalance),
  ]);

  res
    .status(200)
    .json({ msg: `deleted transaction ID: ${id}`, balance: newBalance });
};

module.exports = {
  storeCreditHandler,
  patchCreditHandler,
  deleteCreditHandler,
};
