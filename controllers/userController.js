const bcrypt = require("bcrypt");
const { signUpSchema } = require("../validators/userValidator");
const User = require("../Models/user");

exports.SignUp = async (req, res) => {
  const { error: validationError } = signUpSchema.validate(req.body);
  if (validationError) {
    return res.status(404).send(validationError.details[0].message);
  }

  const { email, password, phoneNumber } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(502).json("The entered email is already registered");
    }

    if (await User.findOne({ phoneNumber })) {
      return res
        .status(502)
        .json("The entered phone number is already registered");
    }

    const user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt); // encrypting password

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
