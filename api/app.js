var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");

var app = express();

// Set up application middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

app.use(express.static( path.join(__dirname, "views") ));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Register routes
var controllers = require("./controllers");

app.get("/", controllers.home.index);
app.get("/health", controllers.home.health);
app.get("/api/initialize_plaid_link", controllers.plaid.initializePlaidLink);
app.post("/api/get_access_token", controllers.plaid.getAccessToken);
app.get("/api/item", controllers.plaid.getItemInformation);
app.get("/api/accounts", controllers.plaid.getItemAccounts);
app.post("/api/transactions", controllers.plaid.getAccountTransactions);

module.exports = app;