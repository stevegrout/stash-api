exports.storeTransactionSchema = {
  type: 'object',
  required: ['amount', 'description', 'type'],
  properties: {
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 200
    },
    amount: {
      type: 'number',
      minimum: 0
    },
    type: {
      type: 'string',
      enum: ['credit', 'debit']
    }
  }
};

exports.updateTransactionSchema = {
  type: 'object',
  properties: {
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 200
    },
    amount: {
      type: 'number',
      minimum: 0
    },
    type: {
      type: 'string',
      enum: ['credit', 'debit']
    }
  }
};
