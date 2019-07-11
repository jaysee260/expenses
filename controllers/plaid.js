var plaid = require("plaid");
var config = require("../config");

var client = new plaid.Client(
  config.plaid.clientId,
  config.plaid.secret,
  config.plaid.publicKey,
  plaid.environments[config.plaid.envs.sandbox],
  {version: '2018-05-22'}
);

var plaidController = {};
plaidController.ACCESS_TOKEN = null;
plaidController.ITEM_ID = null;

plaidController.initializePlaidLink = function(request, response) {

  response.status(200).json({
    PLAID_PUBLIC_KEY: config.plaid.publicKey,
    PLAID_ENV: config.plaid.envs.sandbox,
    PLAID_PRODUCTS: config.plaid.products.transactions,
  });

}

plaidController.getAccessToken = function(request, response) {
  console.log("Received request to exchange public token for access token.");
  console.log("Checking for public token in request body.");
  
  var { public_token } = request.body;

  if (public_token == null || public_token == "") {
    console.log("Public token not found in request body.");
    response.status(400).send("A Plaid public token must be provided in the request body.");
    return;
  }

  console.log("Alledged public token found; will attempt to exchange for acces token by reaching out to Plaid API.");
  client.exchangePublicToken(public_token)
    .then(res => {
      console.log("Successful response from Plaid API.");
      // TODO: Store in cache and associate with current user
      this.ACCESS_TOKEN = res.access_token;
      this.ITEM_ID = res.item_id;

      console.log("Returning obtained access token and item ID to client.");
      response.status(200).json({ access_token: this.ACCESS_TOKEN, item_id: this.ITEM_ID });
    })
    .catch(error => {
      console.log({ error });
      response.status(500).json({ error });
    });

}

// An Item represents a set of credentials at a financial institution
plaidController.getItemInformation = function(request, response) {
  response.status(200).send("<h2>endpoint under construction</h2>");
}

// Accounts are associated with Items
plaidController.getItemAccounts = function(request, response) {
  response.status(200).send("<h2>endpoint under construction</h2>");
}

plaidController.getAccountTransactions = function(request, response) {
  response.status(200).send("<h2>endpoint under construction</h2>");
}


module.exports = plaidController;