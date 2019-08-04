var accountController = {};

accountController.display = function(req, res) {
    var { id } = req.params;
    res.render("account.ejs", { account_id: id });
  }

module.exports = accountController;