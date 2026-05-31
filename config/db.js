const mongoose = require("mongoose");

const url =
  "mongodb+srv://admin:admin2026@testcluster.vovde39.mongodb.net/taskManager?appName=TestCluster";

async function connectDB() {
  try {
    await mongoose.connect(url);
    console.log("The db is connected");
  } catch (err) {
    throw err;
  }
}

module.exports = connectDB;
