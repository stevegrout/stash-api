const {
  getTransaction,
  storeTransaction,
  updateTransaction,
  updateUserBalance,
  deleteTransaction,
  getUserBalance,
  getMonthlyAverages,
} = require('../db/queries');

const { executeTransaction } = require('../db/transaction');

storeTransactionHandler = async (req, res, next) => {
  const { pool } = req;
  const userId = parseInt(req.params.id);
  const { amount, description, type } = req.body;

  let existingBalance;
  try {
    existingBalance = await getUserBalance(pool, userId);
  } catch (err) {
    next(err);
  }
  const newAmount =
    type === 'credit' ? existingBalance + amount : existingBalance - amount;
  const newBalance = Number.parseFloat(newAmount.toFixed(2));

  const saving = await getNewSavingsAmount(pool, userId, newAmount);

  await executeTransaction(pool, [
    (client) =>
      storeTransaction(client, userId, amount, type, description, new Date()),
    (client) => updateUserBalance(client, userId, newBalance, saving),
  ]);

  res.status(201).json({
    msg: `${type} transaction saved`,
    balance: newBalance,
  });
};

updateTransactionHandler = async (req, res) => {
  const { pool } = req;
  const id = parseInt(req.params.id);
  const { amount, description, type } = req.body;

  const existingTransaction = await getTransaction(pool, id);
  const userId = existingTransaction.user_id;
  const existingBalance = await getUserBalance(pool, userId);

  const newBalance = Number.parseFloat(
    getBalanceOnUpdate(existingTransaction, req.body, existingBalance).toFixed(
      2
    )
  );

  await executeTransaction(pool, [
    (client) => updateTransaction(client, id, amount, description, type),
    (client) => updateUserBalance(client, userId, newBalance),
  ]);

  res
    .status(200)
    .json({ msg: `updated transaction ID: ${id}`, balance: newBalance });
};

const getBalanceOnUpdate = (
  existingTransaction,
  newTransaction,
  existingBalance
) => {
  const revertedBalance =
    existingTransaction.type === 'credit'
      ? existingBalance - existingTransaction.amount
      : existingBalance + existingTransaction.amount;
  return newTransaction.type === 'credit'
    ? revertedBalance + newTransaction.amount
    : revertedBalance - newTransaction.amount;
};

deleteTransactionHandler = async (req, res) => {
  const { pool } = req;
  const id = parseInt(req.params.id);

  const transaction = await getTransaction(pool, id);
  const userId = transaction.user_id;
  const existingBalance = await getUserBalance(pool, userId);

  const newAmount =
    transaction.type === 'credit'
      ? existingBalance - transaction.amount
      : existingBalance + transaction.amount;

  const newBalance = Number.parseFloat(newAmount.toFixed(2));

  await executeTransaction(pool, [
    (client) => deleteTransaction(client, id),
    (client) => updateUserBalance(client, userId, newBalance),
  ]);

  res
    .status(200)
    .json({ msg: `deleted transaction ID: ${id}`, balance: newBalance });
};

const getNewSavingsAmount = async (pool, id, balance) => {
  const { rows } = await getMonthlyAverages(pool, id);
  const monthlyCredit = rows.find((average) => average.type === 'credit');
  const monthlyDebit = rows.find((average) => average.type === 'debit');
  const aveMonthlyDiff = monthlyCredit.avg - monthlyDebit.avg;

  let newSavingAmount = 0;
  if (aveMonthlyDiff > 0) {
    newSavingAmount = (balance - (aveMonthlyDiff)) / 2;
  }

  return Number.parseFloat((newSavingAmount).toFixed(2));
};

module.exports = {
  storeTransactionHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
};
