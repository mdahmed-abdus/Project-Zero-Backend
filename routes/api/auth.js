const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
// const { verifyToken } = require("../../middleware/auth");
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../Models/user');

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

router.post(
  '/sign-in',
  [
    check('email', 'Please recheck your email').isEmail(),
    check('password', 'Please recheck your password').isLength({ min: 8 }),
    //.matches('/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'User Not Found' }] });
      }

      const isMatch = await brcypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(502).json({ errors: [{ msg: 'Invalid Password' }] });
      }

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
          res.json({ token });
          console.log('Logged In Succesfully');
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

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
