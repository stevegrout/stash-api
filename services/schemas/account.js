exports.storeTransactionSchema = {
  type: 'object',
  required: ['amount', 'description'],
  properties: {
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 200
    },
    amount: {
      type: 'number'
    }
  }
};

exports.patchTransactionSchema = {
  type: 'object',
  properties: {
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 200
    },
    amount: {
      type: 'number'
    }
  }
};
