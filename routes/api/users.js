const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route  POST api/users
// @desc   Test route
// @access Public

const User = require('../../models/User');

router.post('/', [ check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 })],
    async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
    
        const { name, email, password } = req.body;
        try {
            //See if user exists
            let user = await User.findOne({ email });
            if (user) {
                res.status(400).json({errors:[{msg:"User Already Exist"}]});
            }

            user = new User({
                name,
                email,
                password
            });

            //Encrypt password
            const salt = await brcypt.genSalt(10);
            user.password = await brcypt.hash(password, salt);
            await user.save();

            //Return jsonwebtokens
            // res.send('User Register');

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, 
                config.get('jwtSecret'),
                {expiresIn: 360000}, 
                (err, token)=> {
                    if (err) throw err;
                    res.json({token})
                    console.log("Registration Successful");
                });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    
    // res.send('Users Route')
});


module.exports = router;