const {
  getTransaction,
  storeTransaction,
  updateTransaction,
  updateUserBalances,
  deleteTransaction,
  getUser,
  getMonthlyAverages,
} = require('../db/queries');

const { executeTransaction } = require('../db/transaction');

storeTransactionHandler = async (req, res, next) => {
  const { pool } = req;
  const userId = parseInt(req.params.id);
  const { amount, description, type } = req.body;

  let user;
  try {
    user = await getUser(pool, userId);
  } catch (err) {
    next(err);
  }

  const newAmount = type === 'credit' ? user.balance + amount : user.balance - amount;
  const newBalance = Number.parseFloat(newAmount.toFixed(2));

  const saving = await getNewSavingsAmount(pool, userId, newAmount, user.age);

  await executeTransaction(pool, [
    (client) =>
      storeTransaction(client, userId, amount, type, description, new Date()),
    (client) => updateUserBalances(client, userId, newBalance, saving),
  ]);

  res.status(201).json({
    msg: `${type} transaction saved`,
    balance: newBalance,
  });
};

updateTransactionHandler = async (req, res, next) => {
  const { pool } = req;
  const id = parseInt(req.params.id);
  const { amount, description, type } = req.body;

  let existingTransaction;
  try {
    existingTransaction = await getTransaction(pool, id);
  } catch (err) {
    next(err);
  }
  const userId = existingTransaction.user_id;
  const user = await getUser(pool, userId);

  const newAmount = getBalanceOnUpdate(existingTransaction, req.body, user.balance);
  const newBalance = Number.parseFloat(newAmount.toFixed(2));

  const saving = await getNewSavingsAmount(pool, userId, newAmount, user.age);

  await executeTransaction(pool, [
    (client) => updateTransaction(client, id, amount, description, type),
    (client) => updateUserBalances(client, userId, newBalance, saving),
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

deleteTransactionHandler = async (req, res, next) => {
  const { pool } = req;
  const id = parseInt(req.params.id);

  let transaction;
  try {
    transaction = await getTransaction(pool, id);
  } catch (err) {
    next(err);
  }
  const userId = transaction.user_id;
  const user = await getUser(pool, userId);
  const existingBalance = user.balance;

  const newAmount =
    transaction.type === 'credit'
      ? existingBalance - transaction.amount
      : existingBalance + transaction.amount;

  const newBalance = Number.parseFloat(newAmount.toFixed(2));
  const saving = await getNewSavingsAmount(pool, userId, newAmount, user.age);

  await executeTransaction(pool, [
    (client) => deleteTransaction(client, id),
    (client) => updateUserBalances(client, userId, newBalance, saving),
  ]);

  res
    .status(200)
    .json({ msg: `deleted transaction ID: ${id}`, balance: newBalance });
};

const getNewSavingsAmount = async (pool, id, balance, age) => {
  const { rows } = await getMonthlyAverages(pool, id);
  const monthlyCredit = rows.find((average) => average.type === 'credit') || { avg: 0};
  const monthlyDebit = rows.find((average) => average.type === 'debit') || { avg: 0};
  const aveMonthlyDiff = monthlyDebit.avg + monthlyCredit.avg;

  let newSavingAmount = 0;
  if (aveMonthlyDiff > 0 && balance > 100) {
    newSavingAmount = (aveMonthlyDiff / 100) * (100 - age);  //Due to time - assuming max age is 100
  }

  return Number.parseFloat(newSavingAmount.toFixed(2));
};

module.exports = {
  storeTransactionHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
  getNewSavingsAmount,
};
