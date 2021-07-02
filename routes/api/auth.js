const express = require('express');
const router = express.Router();
// const { verifyToken } = require("../../middleware/auth");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../Models/user');
const { signInSchema } = require('../../validators/userValidator');

// // @route  GET api/auth
// // @desc   Test route
// // @access Public

// router.get("/", verifyToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// @route  POST api/auth
// @desc   Authenticate user and login
// @access Public
router.post('/sign-in', async (req, res) => {
  const { error: validationError } = signInSchema.validate(req.body);
  if (validationError) {
    return res.status(404).send(validationError.details[0].message);
  }

  const { email, password } = req.body;

  try {
    // see if user exists
    const user = await User.findOne({ email });
    const passwordMatch = await bcrypt.compare(password, user?.password || '');
    if (!user || !passwordMatch) {
      return res.status(404).send('Invalid email or password');
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
        console.log('Logged in successfully');
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/* server.get("/logout",auth,async(req,res)=>{
            try{
                res.clear
                console.log('logout successfully');
            }
            catch(error){
                res.status(400).send(error); 
            }
        }) */

// res.send('Users Route')

// router.get("/sign-out", verifyToken, async (req, res) => {
//   try {
//     //res.clearCookie("t");
//     res.cookie("jwt", "", { maxAge: 1 });
//     // res.redirect("/");
//     res.json({ message: "Signed out successfully" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

module.exports = router;
