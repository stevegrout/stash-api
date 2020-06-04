const { transactions, users } = require('./sql');

const storeTransaction = (pool, userId, amount, type, description) => {
  return pool.query(transactions.store, [
    userId,
    amount,
    type,
    description,
    new Date(),
  ]);
};

const updateTransaction = (pool, id, amount, description, type) => {
  return pool.query(transactions.update, [amount, description, type, id]);
};

const getTransaction = async (pool, id) => {
  const { rows } = await pool.query(transactions.get, [id]);
  if (!rows || rows.length < 1) throw new Error('Transaction not found');
  return rows[0];
};

const getUserBalance = async (pool, userId) => {
  const { rows } = await pool.query(users.getUser, [userId]);
  if (!rows || rows.length < 1) throw new Error('User not found');
  return rows[0].balance;
};

const updateUserBalance = (pool, userId, newBalance, saving) => {
  return pool.query(users.updateUserBalance, [newBalance, saving, userId]);
};

const deleteTransaction = (pool, id) => {
  return pool.query(transactions.delete, [id]);
};

const deleteUser = (pool, id) => {
  return pool.query(users.delete, [id]);
};

const getMonthlyAverages = (pool, id) => {
  return pool.query(users.getMonthlyAverages, [id])
};

module.exports = {
  getTransaction,
  storeTransaction,
  updateTransaction,
  getUserBalance,
  updateUserBalance,
  deleteTransaction,
  deleteUser,
  getMonthlyAverages,
};
