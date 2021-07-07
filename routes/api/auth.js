const express = require("express");
const router = express.Router();
const { SignIn } = require("../../controllers/authController");

router.post("/sign-in", SignIn);

module.exports = router;
