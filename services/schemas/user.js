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

exports.updateUserSchema = {
  type: 'object',
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

exports.idCheck = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
    },
  }
};