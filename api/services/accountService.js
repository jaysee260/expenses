var plaidClient = require("../utils/plaid/client");

function AccountService(ACCESS_TOKEN) {
  this.getCreditAndCheckingAccounts = () =>
    new Promise((resolve, reject) => {
      plaidClient.getAccounts(ACCESS_TOKEN)
        .then(accountsResponse => {
          // TODO: Verify if returning item and institution info is of any use
          let { accounts, item } = accountsResponse;
          let filteredAccounts = accounts.filter(acct => acct.subtype === "credit card" || acct.subtype === "checking");
          resolve({ accounts: filteredAccounts, item: { item_id: item.item_id, institution_id: item.institution_id }})
        })
        .catch(error => reject(error));
    });
}

module.exports = (access_token) => new AccountService(access_token);
