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

const updateTransaction = (pool, id, amount, description) => {
  return pool.query(transactions.update, [amount, description, id]);
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

const updateUserBalance = async (pool, userId, newBalance) => {
  return pool.query(users.updateUserBalance, [newBalance, userId]);
};

const deleteTransaction = async (pool, id) => {
  return pool.query(transactions.delete, [id]);
};

const deleteUser = async (pool, id) => {
  return pool.query(users.delete, [id]);
};

module.exports = {
  getTransaction,
  storeTransaction,
  updateTransaction,
  getUserBalance,
  updateUserBalance,
  deleteTransaction,
  deleteUser,
};
