const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../Models/user');
const { signUpSchema } = require('../../validators/userValidator');

// @route  POST api/users
// @desc   Test route
// @access Public
router.post('/sign-up', async (req, res) => {
  const { error: validationError } = signUpSchema.validate(req.body);
  if (validationError) {
    return res.status(404).send(validationError.details[0].message);
  }

  const { name, email, password, phoneNumber } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(502).send('The entered email is already registered');
    }

    if (await User.findOne({ phoneNumber })) {
      return res
        .status(502)
        .send('The entered phone number is already registered');
    }

    const user = new User(req.body);

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(201).json({ _id: user._id, name, email, phoneNumber });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
