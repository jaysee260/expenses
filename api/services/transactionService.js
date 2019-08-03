var plaidClient = require("../utils/plaid/client");

function TransactionService(ACCESS_TOKEN) {
  this.getTransactions = (account_ids, startDate, endDate, count = 10, offset = 0) =>
    new Promise((resolve, reject) => {
      plaidClient.getTransactions(ACCESS_TOKEN, startDate, endDate, { count, offset, account_ids })
        .then(transactionsResponse => resolve(transactionsResponse))
        .catch(error => reject(error));
    });
}

module.exports = (access_token) => new TransactionService(access_token);
