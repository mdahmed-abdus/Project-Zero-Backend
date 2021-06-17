const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route  POST api/users
// @desc   Test route
// @access Public

// chng to admin
const User = require("../../Models/admin");

router.post(
  "/",
  [
    check("name", "Please enter the name correctly").isAlpha(),
    check("email", "Email is required").isEmail(),
    //.matches("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"),
    check("password", "Please enter a valid password").isLength({ min: 8 }),
    //.matches('/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/'),
    check("phoneNumber", "Please enter a valid phone number").isLength({
      min: 10,
      max: 10,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phoneNumber } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: "User Already Exist" }] });
      }

      user = new User({
        name,
        email,
        password,
        phoneNumber,
      });

      //Encrypt password
      const salt = await brcypt.genSalt(10);
      user.password = await brcypt.hash(password, salt);
      await user.save();

      //Return jsonwebtokens
      // res.send('User Register');

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.send("Registration Successful");
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
