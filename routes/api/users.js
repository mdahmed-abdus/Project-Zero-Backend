const express = require("express");
const router = express.Router();
const { SignUp } = require("../../controllers/userController");

// @route  POST api/users
// @desc   Test route
// @access Public

// add regrex for username and password

router.post("/sign-up", SignUp);

module.exports = router;
