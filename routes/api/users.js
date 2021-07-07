const express = require("express");
const router = express.Router();
const { SignUp } = require("../../controllers/userController");

// @route  POST api/users
// @desc   Test route
// @access Public

router.post("/sign-up", SignUp);

module.exports = router;
