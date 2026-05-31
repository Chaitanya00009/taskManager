const express = require("express");
const taskController = require("../controllers/taskController.js");
const router = express.Router();

router.post("/", taskController.createTask);

router.get("/", taskController.getTasks);

router.put("/", taskController.updateTasks);

router.delete("/", taskController.deleteTask);
module.exports = router;
