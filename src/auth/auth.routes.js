const express = require("express");
const { createAccount } = require("./auth.controller");
const router = express.Router();

router.post("/signup", createAccount);

module.exports = router;
