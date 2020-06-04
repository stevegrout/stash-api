const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const {
  Validator,
  ValidationError,
} = require('express-json-validator-middleware');

const { getUserHandler, getAllUsersHandler } = require('./users/get');
const storeUserHandler = require('./users/store');
const updateUserHandler = require('./users/update');

const { getAllTransactionsHandler, getUserTransactionsHandler, getTransactionHandler } = require('./account/get');
const { storeTransactionHandler, updateTransactionHandler, deleteTransactionHandler }  = require('./account/transaction');

const app = express();

const validator = new Validator({ allErrors: true });
const validate = validator.validate;

const { storeUserSchema, updateUserSchema, idCheck } = require('./schemas/user');
const { storeTransactionSchema, updateTransactionSchema } = require('./schemas/account');

const { pool } = require('./db/connect');

const dbPool = function (req, res, next) {
  req.pool = pool;
  next();
};

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(dbPool);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/users', getAllUsersHandler);
app.get('/users/:id', validate({ params: idCheck }), getUserHandler);
app.post('/users', validate({ body: storeUserSchema }), storeUserHandler);
app.put('/users/:id', validate({ body: updateUserSchema, params: idCheck }), updateUserHandler);

app.get('/account/:id', getUserTransactionsHandler);
app.post('/account/:id/transaction', validate({ body: storeTransactionSchema }), storeTransactionHandler);

app.get('/transaction', getAllTransactionsHandler);
app.put('/transaction/:id', validate({ body: updateTransactionSchema }), updateTransactionHandler);
app.delete('/transaction/:id', deleteTransactionHandler);
app.get('/transaction/:id', getTransactionHandler);

app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    res
      .status(400)
      .json({ msg: 'validation error', error: err.validationErrors.body });
    next();
  } else {
    res
      .status(400)
      .json({msg: 'error', error: err.message});
    next();
  }
});

app.listen(3000);
