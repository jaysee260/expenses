var homeController = {};

homeController.health = function(req, res) {
  res.status(200).send("<h2>expenses API - O.K.</h2>");
}

homeController.index = function(req, res) {
  res.status(200).render("index.ejs");
}

homeController.loginPage = function(req, res) {
  res.status(200).render("login.ejs");
}

module.exports = homeController;