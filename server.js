const config = require("./config");
const app = require("./app");
const dbconnect = require("./utils/mongoose");

// Connect to Mongo DB
dbconnect();

app.listen(config.PORT, () => {
  console.log("Server is listening on port: ", config.PORT);
});
