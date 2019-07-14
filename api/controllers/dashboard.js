var dashboardController = {};

dashboardController.home = function(req, res) {
    let config = require("../config/index.json").plaid;
    
    res.render("dashboard.ejs", {
      PLAID_PUBLIC_KEY: config.publicKey,
      PLAID_ENV: config.envs.sandbox,
      PLAID_PRODUCTS: config.products.transactions
    });
  }

module.exports = dashboardController;