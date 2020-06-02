const express = require('express');
const bodyParser = require('body-parser');

const {
  Validator,
  ValidationError,
} = require('express-json-validator-middleware');

const { getUserHandler, getAllUsersHandler } = require('./users/get');
const storeUserHandler = require('./users/store');
const patchUserHandler = require('./users/patch');

const getAllTransactionsHandler = require('./account/get');
const storeCreditHandler = require('./account/credit');
const storeDebitHandler = require('./account/debit');

const app = express();

const validator = new Validator({ allErrors: true });
const validate = validator.validate;

const { storeUserSchema, patchUserSchema } = require('./schemas/user');
const { pool } = require('../db/connect');

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

app.get('/users', getAllUsersHandler);
app.get('/users/:id', getUserHandler);
app.post('/users', validate({ body: storeUserSchema }), storeUserHandler);
app.patch('/users/:id', validate({ body: patchUserSchema }),  patchUserHandler);

app.get('/account/:id', getAllTransactionsHandler);
app.post('/account/:id/credit', storeCreditHandler);
app.post('/account/:id/debit', storeDebitHandler);

app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    res
      .status(400)
      .json({ msg: 'validation error', error: err.validationErrors.body });
    next();
  } else next(err);
});

app.listen(3000);
