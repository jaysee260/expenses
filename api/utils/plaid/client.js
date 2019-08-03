// To be imported by services dependent on the plaid client to do work.
var plaid = require("plaid");
var config = require("../../config").plaid;

module.exports = new plaid.Client(
    config.clientId,
    config.secret,
    config.publicKey,
    plaid.environments[config.envs.sandbox],
    {version: '2018-05-22'}
);
