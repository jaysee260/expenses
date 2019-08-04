var plaid = require("plaid");
var moment = require("moment");
var config = require("../config").plaid;
// var cache = require("../utils/cache");

var client = new plaid.Client(
  config.clientId,
  config.secret,
  config.publicKey,
  plaid.environments[config.envs.sandbox],
  {version: '2018-05-22'}
);

var plaidController = {};
plaidController.ACCESS_TOKEN = null;
plaidController.ITEM_ID = null;
plaidController.INSTITUTION_ID = null;
Object.defineProperty(plaidController, "TRANSACTION_RANGE_IN_DAYS", {
  value: 7,
  writable: false,
  enumerable: true,
  configurable: true
});

plaidController.initializePlaidLink = function(request, response) {
  response.status(200).json({
    PLAID_PUBLIC_KEY: config.publicKey,
    PLAID_ENV: config.envs.sandbox,
    PLAID_PRODUCTS: config.products.transactions,
  });
}

plaidController.getAccessToken = function(request, response) {
  console.log("Received request to get access token.");
  console.log("Checking for public token in request body.");
  
  var { public_token } = request.body;

  if ( !exists(public_token) ) {
    console.log("Public token not found in request body.");
    response.status(400).json({
      status: 400,
      message: "A Plaid public token must be provided in the request body."
    });
    return;
  }

  console.log("Alledged public token found; initiating public token exchange workflow.");
  client.exchangePublicToken(public_token)
    .then(res => {
      console.log("Successful public token exchange.");
      // TODO: Store in cache and associate with current user
      this.ACCESS_TOKEN = res.access_token;
      this.ITEM_ID = res.item_id;

      console.log("Returning obtained access token and item ID to client.");
      response.status(200).json({ access_token: this.ACCESS_TOKEN, item_id: this.ITEM_ID });
    })
    .catch(error => {
      console.log("Failed to exchange public token with Plaid API.");
      console.log({ error });
      response.status(500).json({ error });
    });

}

// An Item represents a set of credentials at a financial institution
plaidController.getItemInformation = function(request, response) {

  if ( !exists(this.ACCESS_TOKEN) ) {
    console.log("Couldn't find access token.");
    response.status(400).json({
      status: 400,
      message: "Couldn't proceed with request; missing access token."
    });
  }

  console.log("Attempting to retrieve item information.");
  client.getItem(this.ACCESS_TOKEN)
    .then(itemResponse => {
      let { item_id, institution_id } = itemResponse.item;
      console.log(`Successfully retrieved item with id: ${item_id}.`);
      console.log(`Will now attempt to retrieve institution information for institution with id: ${institution_id}`);

      client.getInstitutionById(institution_id)
        .then(instResponse => {
          console.log("Successfully retrieved institution information."); // this would be debug logging.
          
          response.status(200).json({
            status: 200,
            data: {
              item: { item_id: itemResponse.item.item_id, },
              institution: {
                name: instResponse.institution.name,
                institution_id: instResponse.institution.institution_id
              }
            }
          });
        })
        .catch(error => {
          console.log("Error while fetching institution data.");
          console.log({ error });
          response.status(500).json({
            status: 500,
            message: "Couldn't retrieve institution information."
          });
        });

    })
    .catch(error => {
      console.log("Error while fetching item data.");
      console.log({ error });
      response.status(500).json({
        status: 500,
        message: "Couldn't retrieve item information."
      });
    });
}

// Accounts are associated with Items
plaidController.getItemAccounts = function(request, response) {

  if ( !exists(this.ACCESS_TOKEN) ) {
    console.log("Unable to find access token.");
    response.status(400).json({
      status: 400,
      message: "Couldn't proceed with request; missing access token."
    });
  }

  client.getAccounts(this.ACCESS_TOKEN)
    .then(accountsResponse => {
      let { accounts, item } = accountsResponse;
      console.log(`Retrieved ${accounts.length} accounts from institution (ID: ${item.institution_id}) with item ID ${item.item_id}.`);

      console.log("Filtering accounts: preserving accounts of 'credit card' and 'checking' subtype only.");
      let filteredAccounts = accounts.filter(acct => acct.subtype === "credit card" || acct.subtype === "checking");

      console.log("Finished filtering accounts.");
      console.log(`Filtered accounts count is: ${filteredAccounts.length}`);

      response.status(200).json({
        status: 200,
        data: {
          accounts: filteredAccounts,
          item: { item_id: item.item_id, institution_id: item.institution_id }
        }
      });
    })
    .catch(error => {
      console.log("Error while getting accounts data.");
      console.log({ error });
      response.status(500).json({ status: 500, error });
    });
}

plaidController.getAccountTransactions = function(request, response) {

  if ( !exists(this.ACCESS_TOKEN) ) {
    console.log("Unable to find access token.");
    response.status(400).json({
      status: 400,
      message: "Couldn't proceed with request; missing access token."
    });
  }

  let { account_ids } = request.body;
  if ( !exists(account_ids) ) {
    console.log("No account_id provided in request body; no transactions to fetch.");
    response.status(400).json({
      status: 400,
      message: "No account_id provided in request body. To get transactions for an account, you must provide an account_id."
    });
  }

  console.log(`Received request to get transactions for account(s) with id(s) ${account_ids}`);

  var startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  var endDate = moment().format('YYYY-MM-DD');
  console.log(`Will attempt to retrieve transactions from ${startDate} to ${endDate}`);
  
  client.getTransactions(this.ACCESS_TOKEN, startDate, endDate, { count: 10, offset: 0, account_ids })
    .then(transactionsResponse => {

      console.log(`Retrieved a total of ${transactionsResponse.total_transactions} transaction(s) from given date range for ${transactionsResponse.accounts.length} account(s).`);
      response.status(200).json({
        status: 200,
        data: transactionsResponse.transactions
      });

    })
    .catch(error => {
      console.log("Error while getting transactions.");
      console.log({ error });
      response.status(500).json({
        status: 500,
        message: "Couldn't get transactions."
      });

    });
}

function exists(value) {
  return !(value == undefined || value == null || value == "");
}

module.exports = plaidController;