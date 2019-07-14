var homeController = {};

homeController.health = function(req, res) {
  response.status(200).send("<h2>expenses API - O.K.</h2>");
}

homeController.index = function(req, res) {
  // res.status(200).send("<h2>You've reached the expenses API's root endpoint.<br/>It doesn't amount to much, but you're here.</h2>");
  let config = require("../config/index.json").plaid;
  
  res.render("index.ejs", {
    PLAID_PUBLIC_KEY: config.publicKey,
    PLAID_ENV: config.envs.sandbox,
    PLAID_PRODUCTS: config.products.transactions
  });
}

module.exports = homeController;