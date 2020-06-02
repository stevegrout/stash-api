exports.storeUserSchema = {
  type: 'object',
  required: ['username', 'age'],
  properties: {
    username: {
      type: 'string',
      minLength: 5,
      maxLength: 20
    },
    age: {
      type: 'integer'
    }
  }
};

exports.patchUserSchema = {
  type: 'object',
  required: ['username', 'age'],
  properties: {
    username: {
      type: 'string',
      minLength: 5,
      maxLength: 20
    },
    age: {
      type: 'integer'
    }
  }
};