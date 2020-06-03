const executeTransaction = async (pool, operations) => {
  const dbtrans = await pool.connect();
  await dbtrans.query('BEGIN');
  try {
    let dbActions = [];
    operations.forEach(operation => dbActions.push(operation(dbtrans)));
    await Promise.all(dbActions);
    await dbtrans.query('COMMIT');
  } catch (error) {
    await dbtrans.query('ROLLBACK');
    throw error;
  } finally {
    dbtrans.release();
  }
};

module.exports = {
  executeTransaction
};
