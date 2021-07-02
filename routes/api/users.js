const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../Models/user');

// @route  POST api/users
// @desc   Test route
// @access Public

// add regrex for username and password

router.post(
  '/sign-up',
  [
    check('name')
      .not()
      .isEmpty()
      .withMessage('Please enter your name')
      .isLength({ min: 2 })
      .withMessage("User's name should atleast be 2 letter long"),
    check('email')
      .not()
      .isEmpty()
      .withMessage('Please enter your email address')
      .isEmail()
      .withMessage('Please enter a valid email address'),
    check('password')
      .not()
      .isEmpty()
      .withMessage('Please enter your password')
      .isLength({ min: 8 })
      .withMessage('Password must be atleast 8 character long'),
    //.matches('/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/'),
    check('phoneNumber')
      .not()
      .isEmpty()
      .withMessage('Please enter your phone number')
      .isNumeric()
      .isLength({ min: 10, max: 10 })
      .withMessage('Please enter a valid phone number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(406).send(errors.array({ onlyFirstError: true }));
    }

    const { name, email, password, phoneNumber } = req.body;
    try {
      //See if user exists
      let userEmail = await User.findOne({ email });
      let userPhoneNumber = await User.findOne({ phoneNumber });
      if (userEmail) {
        return res.status(502).send('The entered email is already registered');
      }
      if (userPhoneNumber) {
        return res
          .status(502)
          .send('The entered phone number is already registered');
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

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).send('Registration Successful');
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
