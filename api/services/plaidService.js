var plaid = require("plaid");
var config = require("../config").plaid;

var client = new plaid.Client(
    config.clientId,
    config.secret,
    config.publicKey,
    plaid.environments[config.envs.sandbox],
    {version: '2018-05-22'}
  );

function plaidService() {
    var _client = client;

    /** Exchanges a public token for an access token */
    this.getAccessToken = function(public_token) {
        return new Promise((resolve, reject) => {
            _client.exchangePublicToken(public_token)
                .then(response => {
                    let { access_token, item_id } = response;
                    resolve({ access_token, item_id });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    /** Gets item associated with access token */
    this.getItem = function() {
        return new Promise((resolve, reject) => {
            // do work
        });
    }

    /** Gets institution associated with specified item id */
    this.getInstitution = function(item_id) {
        return new Promise((resolve, reject) => {
            // do work
        });
    }

    /** Gets accounts associated with item associated with access token */
    this.getAccounts = function() {
        return new Promise((resolve, reject) => {
            // do work
        });
    }

    /** Get transactions associated with specified account(s) */
    this.getTransactions = function(account_id, startDate, endDate) {
        return new Promise((resolve, reject) => {
            // do work
        });
    }
}

module.exports = plaidService;