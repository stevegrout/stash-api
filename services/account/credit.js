const {
  getTransaction,
  storeTransaction,
  updateTransaction,
  updateUserBalance,
  deleteTransaction,
  getUserBalance,
} = require('../db/queries');

storeCreditHandler = async (req, res) => {
  const { pool } = req;
  const userId = parseInt(req.params.id);
  const { amount, description } = req.body;

  const existingBalance = await getUserBalance(pool, userId);

  const dbtrans = await pool.connect();
  await dbtrans.query('BEGIN');
  let newBalance;

  try {
    await storeTransaction(dbtrans, userId, amount, 'credit', description, new Date());
    newBalance = Number.parseFloat((existingBalance + amount).toFixed(2));
    await updateUserBalance(dbtrans, userId, newBalance);
    await dbtrans.query('COMMIT');
  } catch (error) {
    await dbtrans.query('ROLLBACK');
    throw error
  } finally {
    dbtrans.release()
  }

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

  const dbtrans = await pool.connect();
  await dbtrans.query('BEGIN');
  let newBalance;

  try {
    await updateTransaction(dbtrans, id, amount, description);
    newBalance = Number.parseFloat(
      (existingBalance + amount - existingTransaction.amount).toFixed(2)
    );
    await updateUserBalance(dbtrans, userId, newBalance);
    await dbtrans.query('COMMIT');
  } catch (error) {
    await dbtrans.query('ROLLBACK');
    throw error
  } finally {
    dbtrans.release()
  }

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

  const dbtrans = await pool.connect();
  await dbtrans.query('BEGIN');
  let newBalance;

  try {
    await deleteTransaction(dbtrans, id);
    newBalance = Number.parseFloat(
      (existingBalance - transaction.amount).toFixed(2)
    );
    await updateUserBalance(dbtrans, userId, newBalance);
    await dbtrans.query('COMMIT');
  } catch (error) {
    await dbtrans.query('ROLLBACK');
    throw error
  } finally {
    dbtrans.release()
  }

  res
    .status(200)
    .json({ msg: `deleted transaction ID: ${id}`, balance: newBalance });
};

module.exports = {
  storeCreditHandler,
  patchCreditHandler,
  deleteCreditHandler,
};
