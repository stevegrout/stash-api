# stash-api

### To run the API:

Needs docker installed.

- yarn run setup
- yarn install
- yarn start

### Solution:

I've created an express app with a postgres DB. 
The db is run through docker with a setup script to create the tables. 
Validation is done through JSON schema.

In reality I wouldn't use express but it seemed the simplest way for the task.

To view the API docs open [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Savings Calculation:

I created my calculation by getting the average monthly outgoings and incomings for the user from the DB.  
Getting the difference between those two values to see a figure that indicates how much would be left each month.  
I then applied a percentage to that figure based on age - so that younger people would save more, as it is more beneficial
to save over a longer time.

### ToDo:

- Complete the tests on the transaction service to cover debits 
(they would have been very similar to credit tests so left them due to time constraints)

- Update monthly savings when age changed

- Add integration tests to hit the API to test end to end and test for things like validation config (JSON schemas) 
being correctly setup

- Take out DB details from connect.js 

- Use a true maximum age, rather than 100

### Problems:

- The transaction service is not clean as we would like as it's updating balances aswell as transactions

- Age is stored in the DB when it should probably be DOB. 

### Improvements:

- Split the services properly and have them running on serverless - Lambda/API GW rather that express

- Break out the users balance/monthly savings into it's own service & DB table. 

- Have the balance/savings service triggered by events (e.g. changes to transactions or DOB) to keep things clean
