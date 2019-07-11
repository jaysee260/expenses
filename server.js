var app = require("./app");
const PORT = process.PORT || 3000;
const appName = "expenses-API";

function onServerStart() {
  console.log("%s running on http://localhost:%d", appName, PORT);
}

app.listen(PORT, onServerStart);