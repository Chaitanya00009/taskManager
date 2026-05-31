const userController = require("../controllers/userController.js");

const express = require("express");

const router = express.Router();

router.post("/signup", userController.signup);

router.post("/login", userController.login);

module.exports = router;
