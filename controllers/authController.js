const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { signInSchema } = require("../validators/userValidator");
const User = require("../Models/user");

// @route  POST api/auth
// @desc   Authenticate user and login
// @access Public

exports.SignIn = async (req, res) => {
  const { error: validationError } = signInSchema.validate(req.body);
  if (validationError) {
    return res.status(404).send(validationError.details[0].message);
  }

  const { email, password } = req.body;

  try {
    // see if user exists
    const user = await User.findOne({ email });
    const passwordMatch = await bcrypt.compare(password, user.password || "");
    if (!user || !passwordMatch) {
      return res.status(404).send("Invalid email or password");
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
        console.log("Logged in successfully");
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
