const app = require("./app");
const { connectDB } = require("./config/db");
const { serverPort } = require("./secret");

app.listen(serverPort, async () => {
  console.log(`Server is listening port http://localhost:${serverPort}`);
  await connectDB();
});
