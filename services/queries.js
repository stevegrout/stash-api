module.exports = {
  users: {
    getUser: 'SELECT * FROM users WHERE id = $1',
    getAllUsers: 'SELECT * FROM users ORDER BY id ASC',
    storeUser: 'INSERT INTO public.users (username, age, balance, recommended_monthly_savings) VALUES ($1, $2, 0, 0) RETURNING *',
    updateUser: 'UPDATE users SET username = $1, age = $2 WHERE id = $3',
  },
  transactions: {
    getAll: 'SELECT * FROM transactions ORDER BY time ASC',
    store: 'INSERT INTO transactions (user_id, amount, type, description, time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
  }
};
