const { getMonthlyAverages } = require('../../db/queries');

const getNewSavingsAmount = async (pool, id, balance, age) => {
  const { rows } = await getMonthlyAverages(pool, id);
  const monthlyCredit = rows.find((average) => average.type === 'credit') || { avg: 0 };
  const monthlyDebit = rows.find((average) => average.type === 'debit') || { avg: 0 };
  const aveMonthlyDiff = monthlyCredit.avg - monthlyDebit.avg;

  let newSavingAmount = 0;
  if (aveMonthlyDiff > 0 && balance > 100) {
    newSavingAmount = (aveMonthlyDiff / 100) * (100 - age);  //Due to time - assuming max age is 100
  }

  return Number.parseFloat(newSavingAmount.toFixed(2));
};

module.exports = {
  getNewSavingsAmount
};
