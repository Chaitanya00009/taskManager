require("dotenv").config();
const express = require("express");
const server = express();
const routes = require("./routes/userRoutes.js");
const authMiddleware = require("./middleware/authMiddleware.js");
const taskRoutes = require("./routes/taskRoutes.js");
const dbConnection = require("./config/db.js");
server.use(express.json());

server.use("/", routes);
server.use("/tasks", authMiddleware, taskRoutes);
server.get("/health", (req, res) => {
  res.status(200).send("OK");
});

async function startServer() {
  try {
    await dbConnection();
    server.listen(1100, () => {
      console.log("The server is running on 1100 port");
    });
  } catch (err) {
    console.log(err);
  }
}

startServer();
