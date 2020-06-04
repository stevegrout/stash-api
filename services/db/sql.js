module.exports = {
  users: {
    getUser: 'SELECT * FROM users WHERE id = $1',
    getAllUsers: 'SELECT * FROM users ORDER BY id ASC',
    storeUser:
      'INSERT INTO public.users (username, age, balance, recommended_monthly_savings) VALUES ($1, $2, 0, 0) RETURNING *',
    updateUser: 'UPDATE users SET username = $1, age = $2 WHERE id = $3',
    updateUserBalances: 'UPDATE users SET balance = $1, recommended_monthly_savings = $2 WHERE id = $3',
    setRecommendedMonthlySavings:
      'UPDATE users SET recommended_monthly_savings = $1 WHERE id = $2',
    getMonthlyAverages: 'select monthly.type, Avg(monthly.sum) from (' +
      'select type, date_part(\'month\', time), Sum(amount) as sum from transactions where user_id = $1 group by type, date_part(\'month\', time)' +
      ') as monthly group by monthly.type',
    delete: 'DELETE FROM users WHERE id = $1',
  },
  transactions: {
    get: 'SELECT * FROM transactions WHERE id = $1',
    getAllForUser: 'SELECT * FROM transactions WHERE user_id = $1',
    getAll: 'SELECT * FROM transactions ORDER BY time ASC',
    store:
      'INSERT INTO transactions (user_id, amount, type, description, time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    update:
      'UPDATE transactions SET amount = $1, description = $2, type = $3 WHERE id = $4',
    delete: 'DELETE FROM transactions WHERE id = $1',
  },
};
